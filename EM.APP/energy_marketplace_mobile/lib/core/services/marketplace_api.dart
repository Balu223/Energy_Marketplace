import 'package:dio/dio.dart';
import 'package:energy_marketplace_mobile/core/models/marketplace_item.dart';
import 'package:energy_marketplace_mobile/core/services/api_client.dart';

class MarketplaceApi {
  final ApiClient client;

  MarketplaceApi({required this.client});

  Future<List<MarketplaceItem>> getSummary() async {
    final Response res = await client.dio.get('/marketplace/summary');

    if (res.statusCode != 200) {
      throw Exception('Failed to load marketplace summary '
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