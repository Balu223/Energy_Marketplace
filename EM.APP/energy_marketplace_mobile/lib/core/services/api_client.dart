import 'package:dio/dio.dart';

class ApiClient {
  final Dio dio;

  ApiClient._(this.dio);

  factory ApiClient({required String baseUrl, String? token}) {
    final dio = Dio(
      BaseOptions(
        baseUrl: baseUrl,
        connectTimeout: const Duration(seconds: 10),
        receiveTimeout: const Duration(seconds: 10),
        headers: {
          'Content-Type': 'application/json',
          if (token != null) 'Authorization': 'Bearer $token',
        },
      ),
    );

    return ApiClient._(dio);
  }

  /// Alternatíva: ha már van egy Dio-d (pl. AuthService.buildDio),
  /// ebből is csinálhatsz ApiClientet:
  factory ApiClient.fromDio(Dio dio) => ApiClient._(dio);
}
