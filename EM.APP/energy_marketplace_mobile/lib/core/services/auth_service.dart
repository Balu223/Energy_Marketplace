
import 'package:flutter_web_auth_2/flutter_web_auth_2.dart';
import 'package:dio/dio.dart';

const auth0Domain = 'dev-6lmzih7t2mbvxjwp.us.auth0.com';
const auth0ClientId = 'dThx7CCg5cagu9AUFYWyvXpBSb4NSp4Q'; // ezt vedd ki a dashboardról
const auth0Audience = 'https://dev-6lmzih7t2mbvxjwp.us.auth0.com/api/v2/';
const auth0RedirectUri = 'emapp://login-callback';

const apiBaseUrl = 'http://10.0.2.2:5159/api';

class AuthService {
  final String domain;
  final String clientId;
  final String redirectUri;
  final String audience;

  String? _accessToken;

  AuthService({
    required this.domain,
    required this.clientId,
    required this.redirectUri,
    required this.audience,
  });

  String? get accessToken => _accessToken;

  Future<void> login() async {
    final url =
        'https://$domain/authorize'
        '?response_type=token'
        '&client_id=$clientId'
        '&redirect_uri=$redirectUri'
        '&scope=openid%20profile%20email'
        '&audience=$audience';

    final result = await FlutterWebAuth2.authenticate(
  url: url,
  callbackUrlScheme: Uri.parse(redirectUri).scheme,
);

// debug:
print('Auth0 callback result: $result');

final fragment = Uri.parse(result).fragment;
print('Fragment: $fragment');

final params = Uri.splitQueryString(fragment);
print('Params: $params');

_accessToken = params['access_token'];
    if (_accessToken == null) {
      throw Exception('No access token returned from Auth0');
    }
  }

  Dio buildDio({required String baseUrl}) {
    final dio = Dio(
      BaseOptions(
        baseUrl: baseUrl,
        connectTimeout: const Duration(seconds: 10),
        receiveTimeout: const Duration(seconds: 10),
      ),
    );

    if (_accessToken != null) {
      dio.options.headers['Authorization'] = 'Bearer $_accessToken';
    }

    return dio;
  }
}
