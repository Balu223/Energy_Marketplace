import 'package:dio/dio.dart';
import 'package:energy_marketplace_mobile/core/models/user_response.dart';
import 'package:energy_marketplace_mobile/core/services/api_client.dart';

class UserService {
  final ApiClient client;

  UserService({required this.client});

  Future<UserResponse> getMe() async {
    final Response res = await client.dio.get('/user/me');

    if (res.statusCode != 200) {
      throw Exception('Failed to load user: '
          '(status: ${res.statusCode})');
    }

    final data = res.data as Map<String, dynamic>;

    return UserResponse.fromJson(data);
  }
}