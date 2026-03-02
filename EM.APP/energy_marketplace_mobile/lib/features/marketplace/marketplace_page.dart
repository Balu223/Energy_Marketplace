import 'package:energy_marketplace_mobile/core/models/user_response.dart';
import 'package:energy_marketplace_mobile/core/services/api_client.dart';
import 'package:energy_marketplace_mobile/features/marketplace/marketplace_chart_widget.dart';
import 'package:energy_marketplace_mobile/features/trade/trade_dialog.dart';
import 'package:flutter/material.dart';
import '../../../core/models/marketplace_item.dart';

class MarketplacePage extends StatefulWidget {
  final List<MarketplaceItem> items;
  final UserResponse currentUser;
  final ApiClient client;
  final Future<void> Function()? onRefreshRequested;

  const MarketplacePage({
    super.key,
    required this.items,
    required this.currentUser,
    required this.client,
    this.onRefreshRequested
  });

  @override
  State<MarketplacePage> createState() => _MarketplacePageState();
}

class _MarketplacePageState extends State<MarketplacePage> {
  Color _buyColor() => const Color.fromARGB(255, 63, 243, 156);
  Color _sellColor() => Colors.redAccent;

  IconData productIcon(String name) {
    final n = name.toLowerCase();
    if (n.contains('electricity')) return Icons.electric_bolt;
    if (n.contains('gas')) return Icons.local_fire_department_rounded;
    if (n.contains('oil')) return Icons.oil_barrel;
    return Icons.energy_savings_leaf;
  }

  void _openTradeSheet(BuildContext context, MarketplaceItem item, String mode) async {
    final shouldRefresh = await showModalBottomSheet<bool>(
      context: context,
      backgroundColor: const Color(0xFF161B22),
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(16)),
      ),
      builder: (context) => TradeWidget(
        item: item,
        mode: mode,
        userId: widget.currentUser.userId,
        client: widget.client,
      ),
    );
    if (shouldRefresh == true && widget.onRefreshRequested != null) {
      await widget.onRefreshRequested!();
    }
  }

  @override
  Widget build(BuildContext context) {
    final items = widget.items;
    if (items.isEmpty) {
      return const Center(child: Text('No items'));
    }

    final sortedList = [...items]
      ..sort((a, b) => a.productId.compareTo(b.productId));

    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          MarketplaceBarChart(items: items),
          const SizedBox(height: 24),
          ListView.separated(
            physics: const NeverScrollableScrollPhysics(),
            shrinkWrap: true,
            itemCount: sortedList.length,
            separatorBuilder: (_, _) => const SizedBox(height: 8),
            itemBuilder: (context, index) {
              final item = sortedList[index];
              return Card(
                color: const Color(0xFF161B22),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
                child: ListTile(
                  leading: Icon(productIcon(item.productName)),
                  title: Text(
                    item.productName,
                    style: const TextStyle(
                      color: Colors.white,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                  subtitle: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const SizedBox(height: 4),
                      Row(
                        children: [
                          Expanded(
                            child: ElevatedButton(
                              style: ElevatedButton.styleFrom(
                                backgroundColor: _buyColor(),
                                padding:
                                    const EdgeInsets.symmetric(vertical: 8),
                                shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(8),
                                ),
                              ),
                              onPressed: () =>
                                  _openTradeSheet(context, item, 'buy'),
                              child: Text(
                                'Buy: ${item.purchasePricePerUnit} HUF',
                                style: const TextStyle(
                                  color: Colors.black,
                                  fontWeight: FontWeight.w600,
                                ),
                              ),
                            ),
                          ),
                          const SizedBox(width: 8),
                          Expanded(
                            child: ElevatedButton(
                              style: ElevatedButton.styleFrom(
                                backgroundColor: _sellColor(),
                                padding:
                                    const EdgeInsets.symmetric(vertical: 8),
                                shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(8),
                                ),
                              ),
                              onPressed: () =>
                                  _openTradeSheet(context, item, 'sell'),
                              child: Text(
                                'Sell: ${item.salePricePerUnit} HUF',
                                style: const TextStyle(
                                  color: Colors.black,
                                  fontWeight: FontWeight.w600,
                                ),
                              ),
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 4),
                      Text(
                        'Qty: ${item.quantity.round()} ${item.unit ?? ''}',
                        style: const TextStyle(color: Colors.grey),
                      ),
                    ],
                  ),
                ),
              );
            },
          ),
        ],
      ),
    );
  }
}
