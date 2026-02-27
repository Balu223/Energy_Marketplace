import 'package:fl_chart/fl_chart.dart';
import 'package:flutter/material.dart';
import '../../../core/models/marketplace_item.dart';

class MarketplaceBarChart extends StatelessWidget {
  final List<MarketplaceItem> items;

  const MarketplaceBarChart({super.key, required this.items});

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
    if (items.isEmpty) {
      return const SizedBox.shrink();
    }

    final sorted = [...items]
      ..sort((a, b) => b.quantity.compareTo(a.quantity));

    final maxQuantity = sorted
        .map((e) => e.quantity)
        .fold<double>(0, (p, c) => c > p ? c : p);

    return Padding(
      padding: const EdgeInsets.only(top: 12),
      child: SizedBox(
        height: 100.0 * sorted.length + 40,
        child: BarChart(
          BarChartData(
            minY: 0,
            maxY: maxQuantity * 1.1,
            barTouchData: BarTouchData(enabled: true),
            gridData: FlGridData(show: false),
            borderData: FlBorderData(show: false),
            barGroups: [
              for (int i = 0; i < sorted.length; i++)
                BarChartGroupData(
                  x: i,
                  barRods: [
                    BarChartRodData(
                      toY: sorted[i].quantity,
                      width: 50,
                      borderRadius: BorderRadius.circular(3),
                      color: _colorForProduct(sorted[i].productName),
                    ),
                  ],
                ),
            ],
            titlesData: FlTitlesData(
              topTitles:
                  const AxisTitles(sideTitles: SideTitles(showTitles: false)),
              rightTitles:
                  const AxisTitles(sideTitles: SideTitles(showTitles: false)),
              bottomTitles: AxisTitles(
                sideTitles: SideTitles(
                  showTitles: true,
                  reservedSize: 30,
                  getTitlesWidget:
                  (value, meta) {
                    final index = value.toInt();
                    if (index < 0 || index >= sorted.length) {
                      return const SizedBox.shrink();
                    }
                    final item = sorted[index];
                    return Padding(
                      padding: const EdgeInsets.only(right: 0),
                      child: Text(
                        '${item.productName}\n  (${item.unit})',
                        style: const TextStyle(
                          color: Colors.white,
                          fontSize: 11,
                        ),
                      ),
                    );
                  },
                ),
              ),
              leftTitles: AxisTitles(
                sideTitles: SideTitles(
                  showTitles: true,
                  reservedSize: 30,
                  getTitlesWidget:  (value, meta) {
                    return Text(
                      value.toInt().toString(),
                      style: const TextStyle(
                        color: Colors.grey,
                        fontSize: 10,
                      ),
                    );
                  },
                ),
              ),
            ),
            groupsSpace: 8,
          ),
        ),
      ),
    );
  }
}