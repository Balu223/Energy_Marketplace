import 'package:energy_marketplace_mobile/core/models/marketplace_item.dart';
import 'package:energy_marketplace_mobile/core/models/trade_request.dart';
import 'package:energy_marketplace_mobile/core/services/api_client.dart';
import 'package:energy_marketplace_mobile/core/services/marketplace_api.dart';
import 'package:flutter/material.dart';

class TradeWidget extends StatelessWidget {
  final MarketplaceItem item;
  final String mode;
  final int userId;
  final ApiClient client;

  const TradeWidget({
    super.key,
    required this.item,
    required this.mode,
    required this.userId,
    required this.client,
  });

  @override
  Widget build(BuildContext context) {
    final controller = TextEditingController();
    final api = MarketplaceApi(client: client);

    return Padding(
      padding: const EdgeInsets.fromLTRB(16, 16, 16, 24),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Text(
            '${mode == 'buy' ? 'Buy' : 'Sell'} ${item.productName}',
            style: const TextStyle(
              color: Colors.white,
              fontSize: 18,
              fontWeight: FontWeight.w600,
            ),
          ),
          const SizedBox(height: 12),
          TextField(
            controller: controller,
            keyboardType:
                const TextInputType.numberWithOptions(decimal: true),
            style: const TextStyle(color: Colors.white),
            decoration: InputDecoration(
              labelText: 'Quantity (${item.unit ?? ''})',
              labelStyle: const TextStyle(color: Colors.grey),
              enabledBorder: const OutlineInputBorder(
                borderSide: BorderSide(color: Color(0xFF30363D)),
              ),
              focusedBorder: const OutlineInputBorder(
                borderSide: BorderSide(color: Color(0xFF45A5F5)),
              ),
            ),
          ),
          const SizedBox(height: 16),
          ElevatedButton(
            style: ElevatedButton.styleFrom(
              backgroundColor: mode == 'buy'
                  ? const Color(0xFF1976D2)
                  : const Color(0xFFD32F2F),
              padding: const EdgeInsets.symmetric(vertical: 12),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(8),
              ),
            ),
            onPressed: () async {
              final text = controller.text.trim();
              if (text.isEmpty) return;
              final qty = double.tryParse(text);
              if (qty == null || qty <= 0) return;

              final request = TradeRequest(
                productId: item.productId,
                userId: userId,
                quantity: qty,
              );

              try {
                await api.executeTrade(mode, request);
                
                if (context.mounted) {
                  Navigator.of(context).pop(true);
                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(
                      content: Text(
                        '${mode == 'buy' ? 'Buy' : 'Sell'} order sent.',
                      ),
                    ),
                  );
                }
              } catch (e) {
                if (context.mounted) {
                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(content: Text('Trade failed: $e')),
                  );
                }
              }
            },
            child: Text(
              mode == 'buy' ? 'Confirm Purchase' : 'Confirm Sale',
              style: const TextStyle(
                color: Colors.white,
                fontWeight: FontWeight.w600,
              ),
            ),
          ),
        ],
      ),
    );
  }
}
