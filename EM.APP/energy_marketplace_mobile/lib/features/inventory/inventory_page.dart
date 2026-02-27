import 'package:fl_chart/fl_chart.dart';
import 'package:flutter/material.dart';
import '../../../core/models/marketplace_item.dart';

class InventoryPage extends StatelessWidget {
  final List<MarketplaceItem> inventoryItems;

  const InventoryPage({super.key, required this.inventoryItems});
double _totalInventoryValue() {
    return inventoryItems.fold<double>(
      0,
      (sum, item) => sum + item.quantity * item.salePricePerUnit,
    );
  }

  List<_ProductTotal> _productTotals() {
    return inventoryItems
        .map(
          (e) => _ProductTotal(
            name: e.productName,
            unit: e.unit,
            qty: e.quantity,
            totalValue: e.quantity * e.salePricePerUnit,
          ),
        )
        .toList()
      ..sort((a, b) => b.totalValue.compareTo(a.totalValue));
  }
  IconData productIcon(String name) {
    final n = name.toLowerCase();
    if (n.contains('electricity')) return Icons.electric_bolt;
    if (n.contains('gas')) return Icons.local_fire_department_rounded;
    if (n.contains('oil')) return Icons.oil_barrel;
    return Icons.energy_savings_leaf;
  }

  Color _colorForProduct(String name) {
    if (name.toLowerCase().contains('electricity')) {
      return Colors.lightBlue;
    }
    if (name.toLowerCase().contains('gas')) {
      return const Color.fromARGB(255, 140, 205, 65);
    }
    if (name.toLowerCase().contains('oil')) {
      return Colors.orangeAccent;
    }
    return const Color(0xFF45A5F5);
  }

  @override
  Widget build(BuildContext context) {
    if (inventoryItems.isEmpty) {
      return const Center(child: Text('No inventory items'));
    }
    final totalValue = _totalInventoryValue();
    final totals = _productTotals();
    final sorted = [...inventoryItems]
      ..sort((a, b) => a.productId.compareTo(b.productId));

    final maxQty = sorted
        .map((e) => e.quantity)
        .fold<double>(0, (p, c) => c > p ? c : p);

    return Scaffold(
      body: SingleChildScrollView(
        physics: const BouncingScrollPhysics(),
      child: Column(
        children: [
          Padding(
            padding: const EdgeInsets.all(16),
            child: SizedBox(
              height: 100.0 * sorted.length ,
              child: RotatedBox(
                quarterTurns: 1,
                child: BarChart(
                  BarChartData(
                    minY: 0,
                    
                    maxY: (maxQty).roundToDouble(),
                    gridData: FlGridData(show: true,                  
                    drawVerticalLine: false,
                    getDrawingHorizontalLine: (value) => FlLine(
                            color: Colors.white38,
                            strokeWidth: 1,
                          ),
                          ),
                    borderData: FlBorderData( show: true, border: const Border(bottom: BorderSide(color: Colors.white38, width: 1), /*right: BorderSide(color: Colors.white38, width: 1)*/  )
                              ),
                    barGroups: [
                      for (int i = 0; i < sorted.length; i++)
                        BarChartGroupData(
                          x: i,
                          barRods: [
                            BarChartRodData(
                              toY: sorted[i].quantity,
                              width: 50,
                              borderRadius: BorderRadius.circular(6),
                              color: _colorForProduct(sorted[i].productName),
                              
                            ),
                          ],
                        ),
                    ],
                    titlesData: FlTitlesData(
                      topTitles: const AxisTitles(
                        sideTitles: SideTitles(showTitles: false),
                      ),
                      rightTitles: const AxisTitles(
                        sideTitles: SideTitles(showTitles: false),
                      ),
              
                      bottomTitles: AxisTitles(
                        sideTitles: SideTitles(
                          showTitles: true,
                          reservedSize: 35,
                          getTitlesWidget: (value, meta) {
                            final index = value.toInt();
                            if (index < 0 || index >= sorted.length) {
                              return const SizedBox.shrink();
                            }
                            final item = sorted[index];
                            return RotatedBox(
                              quarterTurns: 3,
                              child: Padding(
                                padding: const EdgeInsets.only(right: 4),
              
                                child: Icon(productIcon(item.productName)),
                              ),
                            );
                          },
                        ),
                      ),
              
                      leftTitles: AxisTitles(
                        sideTitles: SideTitles(
                          showTitles: true,
                          reservedSize: 15,
                          getTitlesWidget: (value, meta) {
                            if (value == meta.max) {
                               return const Text('');
                            } else if (value == meta.min) {
                             return const Text('');
                            }
                             else {
                              return RotatedBox(
                              quarterTurns: 3,
                              child: Text(
                                value.toInt().toString(),
                                style: const TextStyle(
                                  color: Colors.grey,
                                  fontSize: 12,
                                ),
                              ),
                            );
                            }
                          },
                        ),
                      ),
                    ),
                  ),
                ),
              ),
            ),
            
          ),
          Card(
              color: const Color(0xFF161B22),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(12),
                side: const BorderSide(color: Color(0xFF30363D)),
              ),
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      'Total inventory value',
                      style: TextStyle(
                        color: Colors.grey,
                        fontSize: 12,
                      ),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      '${totalValue.toStringAsFixed(0)} HUF',
                      style: const TextStyle(
                        color: Colors.white,
                        fontSize: 20,
                        fontWeight: FontWeight.w700,
                      ),
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 16),
      
            // 3) PRODUCTONKÉNTI TOTAL VALUE LISTA
            Card(
              color: const Color(0xFF161B22),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(12),
                side: const BorderSide(color: Color(0xFF30363D)),
              ),
              child: Padding(
                padding: const EdgeInsets.all(12),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      'Holdings by value',
                      style: TextStyle(
                        color: Colors.grey,
                        fontSize: 12,
                      ),
                    ),
                    const SizedBox(height: 8),
                    ...totals.map((t) {
                      final pct = totalValue == 0
                          ? 0
                          : (t.totalValue / totalValue * 100);
                      return Padding(
                        padding: const EdgeInsets.symmetric(vertical: 6),
                        child: Row(
                          children: [
                            Expanded(
                              child: Text(
                                t.name,
                                style: const TextStyle(
                                  color: Colors.white,
                                  fontSize: 14,
                                ),
                              ),
                            ),
                            const SizedBox(width: 8),
                            Text(
                              '${t.qty.toStringAsFixed(2)} ${t.unit ?? ''}',
                              style: const TextStyle(
                                color: Colors.grey,
                                fontSize: 12,
                              ),
                            ),
                            const SizedBox(width: 12),
                            Column(
                              crossAxisAlignment: CrossAxisAlignment.end,
                              children: [
                                Text(
                                  '${t.totalValue.toStringAsFixed(0)} HUF',
                                  style: const TextStyle(
                                    color: Colors.white,
                                    fontSize: 13,
                                    fontWeight: FontWeight.w600,
                                  ),
                                ),
                                Text(
                                  '${pct.toStringAsFixed(1)}%',
                                  style: const TextStyle(
                                    color: Colors.grey,
                                    fontSize: 11,
                                  ),
                                ),
                              ],
                            ),
                          ],
                        ),
                      );
                    }),
                  ],
              ),
            ),
            ),
        ]
      ),
      )
    );
  }
}


class _ProductTotal {
  final String name;
  final String? unit;
  final double qty;
  final double totalValue;

  _ProductTotal({
    required this.name,
    required this.unit,
    required this.qty,
    required this.totalValue,
  });
}