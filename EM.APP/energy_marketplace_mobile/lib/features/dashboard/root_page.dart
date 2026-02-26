import 'package:energy_marketplace_mobile/core/services/api_client.dart';
import 'package:energy_marketplace_mobile/core/services/marketplace_api.dart';
import 'package:energy_marketplace_mobile/features/marketplace/marketplace_chart_widget.dart';
import 'package:flutter/material.dart';
import '../../core/services/auth_service.dart';
import '../../core/models/marketplace_item.dart';

class RootPage extends StatefulWidget {
  const RootPage({super.key});

  @override
  State<RootPage> createState() => _RootScreenState();
}

class _RootScreenState extends State<RootPage> {
  late AuthService _auth;
  List<MarketplaceItem>? _items;
  // ignore: unused_field
  String? _error;
  bool _loading = false;

  @override
  void initState() {
    super.initState();
    _auth = AuthService(
      domain: auth0Domain,
      clientId: auth0ClientId,
      redirectUri: auth0RedirectUri,
      audience: auth0Audience,
    );
  }

Future<void> _loginAndLoad() async {
  setState(() {
    _loading = true;
    _error = null;
  });

  try {
    await _auth.login();
    print('Login OK, token: ${_auth.accessToken?.substring(0, 16)}...');

    final dio = _auth.buildDio(baseUrl: apiBaseUrl);
    print('Dio headers: ${dio.options.headers}');

    final client = ApiClient.fromDio(dio);
    final api = MarketplaceApi(client: client);

    final items = await api.getSummary();
    print('Loaded ${items.length} items from API');

    setState(() {
      _items = items;
    });
  } catch (e, st) {
    print('Error in _loginAndLoad: $e');
    print(st);
    setState(() {
      _error = e.toString();
    });
  } finally {
    setState(() {
      _loading = false;
    });
  }
}

  @override
  Widget build(BuildContext context) {
    if (_loading) {
      return const Scaffold(
        body: Center(child: CircularProgressIndicator()),
      );
    }

    if (_items == null) {
  return Scaffold(
    appBar: AppBar(title: const Text('Login')),
    body: Center(
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          if (_error != null) ...[
            Text(
              _error!,
              textAlign: TextAlign.center,
              style: const TextStyle(color: Colors.red),
            ),
            const SizedBox(height: 12),
          ],
          ElevatedButton(
            onPressed: _loginAndLoad,
            child: const Text('Login with Auth0'),
          ),
        ],
      ),
    ),
  );
}

   return Scaffold(
  appBar: AppBar(title: const Text('Marketplace')),
  body: SingleChildScrollView(
    padding: const EdgeInsets.all(16),
    child: Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        // 1) CHART FENT
        MarketplaceBarChart(items: _items!),
        const SizedBox(height: 24),

        // 2) LISTA ALATTA
        ListView.builder(
          shrinkWrap: true,
          physics: const NeverScrollableScrollPhysics(),
          itemCount: _items!.length,
          itemBuilder: (context, index) {
            final item = _items![index];
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
              ),
            );
          },
        ),
      ],
    ),
  ),
);
  }
}