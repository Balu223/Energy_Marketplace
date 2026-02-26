import 'package:fl_chart/fl_chart.dart';
import 'package:flutter/material.dart';
import '../../../core/models/marketplace_item.dart';

class MarketplaceBarChart extends StatelessWidget {
  final List<MarketplaceItem> items;

  const MarketplaceBarChart({super.key, required this.items});

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

    return SizedBox(
      height: 48.0 * sorted.length + 40,
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
                    width: 16,
                    borderRadius: BorderRadius.circular(6),
                    color: const Color(0xFF45A5F5),
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
                reservedSize: 24,
                getTitlesWidget: (value, meta) {
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
            leftTitles: AxisTitles(
              sideTitles: SideTitles(
                showTitles: true,
                reservedSize: 90,
                getTitlesWidget: (value, meta) {
                  final index = value.toInt();
                  if (index < 0 || index >= sorted.length) {
                    return const SizedBox.shrink();
                  }
                  final item = sorted[index];
                  return Padding(
                    padding: const EdgeInsets.only(right: 4),
                    child: Text(
                      item.productName,
                      style: const TextStyle(
                        color: Colors.white,
                        fontSize: 11,
                      ),
                    ),
                  );
                },
              ),
            ),
          ),
          groupsSpace: 8,
        ),
      ),
    );
  }
}
