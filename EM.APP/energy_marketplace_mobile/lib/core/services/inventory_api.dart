import 'package:dio/dio.dart';
import 'package:energy_marketplace_mobile/core/models/marketplace_item.dart';
import 'package:energy_marketplace_mobile/core/services/api_client.dart';

class InventoryApi {
  final ApiClient client;

  InventoryApi({required this.client});

  Future<List<MarketplaceItem>> getInventory() async {
    final Response res = await client.dio.get('/inventory/generate-missing');

    if (res.statusCode != 200) {
      throw Exception('Failed to load inventory '
          '(status: ${res.statusCode})');
    }

    final data = res.data;
    if (data is! List) {
      throw Exception('Invalid response format');
    }

    return data
        .map((e) => MarketplaceItem.fromJson(e as Map<String, dynamic>))
        .toList();
  }
}