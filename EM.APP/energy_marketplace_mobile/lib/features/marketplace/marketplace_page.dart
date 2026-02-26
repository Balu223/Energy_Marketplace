import 'package:energy_marketplace_mobile/core/services/api_client.dart';
import 'package:energy_marketplace_mobile/core/services/marketplace_api.dart';
import 'package:energy_marketplace_mobile/features/marketplace/marketplace_chart_widget.dart';
import 'package:flutter/material.dart';
import '../../../core/models/marketplace_item.dart';

class MarketplacePage extends StatefulWidget {
  const MarketplacePage({super.key});

  @override
  State<MarketplacePage> createState() => _MarketplaceScreenState();
}

class _MarketplaceScreenState extends State<MarketplacePage> {
  late Future<List<MarketplaceItem>> _future;

  @override
  void initState() {
    super.initState();
    final client = ApiClient(baseUrl: 'http://10.0.2.2:5159/api', token: null);
    final api = MarketplaceApi(client: client);
    _future = api.getSummary();
  }

 @override
Widget build(BuildContext context) {
  return Scaffold(
    appBar: AppBar(title: const Text('Marketplace')),
    body: FutureBuilder<List<MarketplaceItem>>(
      future: _future,
      builder: (context, snapshot) {
        if (snapshot.connectionState == ConnectionState.waiting) {
          return const Center(child: CircularProgressIndicator());
        }
        if (snapshot.hasError) {
          return Center(
            child: Text(
              'Error: ${snapshot.error}',
              textAlign: TextAlign.center,
            ),
          );
        }
        final items = snapshot.data ?? [];
        if (items.isEmpty) {
          return const Center(child: Text('No items'));
        }

        return SingleChildScrollView(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              // 1) CHART FENT
              MarketplaceBarChart(items: items),
              const SizedBox(height: 24),

              // 2) LISTA ALATTA
              ListView.separated(
                physics: const NeverScrollableScrollPhysics(),
                shrinkWrap: true,
                itemCount: items.length,
                separatorBuilder: (_, _) => const SizedBox(height: 8),
                itemBuilder: (context, index) {
                  final item = items[index];
                  return Card(
                    color: const Color(0xFF161B22),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: ListTile(
                      title: Text(
                        item.productName,
                        style: const TextStyle(
                          color: Colors.white,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                      subtitle: Text(
                        'Buy: ${item.purchasePricePerUnit} HUF, '
                        'Sell: ${item.salePricePerUnit} HUF\n'
                        'Qty: ${item.quantity} ${item.unit ?? ''}',
                        style: const TextStyle(color: Colors.grey),
                      ),
                      onTap: () {
                        // ide jön majd a trade UI
                      },
                    ),
                  );
                },
              ),
            ],
          ),
        );
      },
    ),
  );
}
}