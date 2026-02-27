import 'package:energy_marketplace_mobile/core/services/api_client.dart';
import 'package:energy_marketplace_mobile/core/services/inventory_api.dart';
import 'package:energy_marketplace_mobile/core/services/marketplace_api.dart';
import 'package:energy_marketplace_mobile/features/inventory/inventory_page.dart';
import 'package:energy_marketplace_mobile/features/marketplace/marketplace_page.dart';
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
  List<MarketplaceItem>? _inventoryItems;
  // ignore: unused_field
  String? _error;
  bool _loading = false;
  int _selectedIndex = 0;

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
    final marketplaceApi = MarketplaceApi(client: client);
    final inventoryApi = InventoryApi(client: client);

    final items = await marketplaceApi.getSummary();
    print('Loaded ${items.length} items from API');

    final inventoryItems = await inventoryApi.getInventory();

    setState(() {
      _items = items;
      _inventoryItems = inventoryItems;
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

 void _onTabTap(int index) {
    setState(() {
      _selectedIndex = index;
    });
  }

  Widget _buildBody() {
    // loading / login state
    if (_loading) {
      return const Center(child: CircularProgressIndicator());
    }

    if (_items == null) {
      return Center(
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
      );
    }

    // ha már van adat, itt váltunk tab szerint
    switch (_selectedIndex) {
      case 0:
        return MarketplacePage(items: _items!);
      case 1:
        return  InventoryPage(inventoryItems: _inventoryItems!);
      case 2:
        return  MarketplacePage(items: _items!);
      default:
        return  MarketplacePage(items: _items!);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(
          _selectedIndex == 0
              ? 'Dashboard'
              : _selectedIndex == 1
                  ? 'Inventory'
                  : 'Profile',
        ),
      ),
      body: _buildBody(),
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: _selectedIndex,
        onTap: _onTabTap,
        items: const [
          BottomNavigationBarItem(
            icon: Icon(Icons.dashboard),
            label: 'Dashboard',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.list_alt),
            label: 'Inventory',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.person),
            label: 'Profile',
          ),
        ],
      ),
    );
  }
}