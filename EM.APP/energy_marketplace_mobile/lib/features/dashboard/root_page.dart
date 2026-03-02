import 'package:energy_marketplace_mobile/core/models/user_response.dart';
import 'package:energy_marketplace_mobile/core/services/api_client.dart';
import 'package:energy_marketplace_mobile/core/services/inventory_api.dart';
import 'package:energy_marketplace_mobile/core/services/marketplace_api.dart';
import 'package:energy_marketplace_mobile/core/services/user_service.dart';
import 'package:energy_marketplace_mobile/features/inventory/inventory_page.dart';
import 'package:energy_marketplace_mobile/features/marketplace/marketplace_page.dart';
import 'package:energy_marketplace_mobile/features/profile/profile_page.dart';
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
  ApiClient? _client;

  List<MarketplaceItem>? _items;
  List<MarketplaceItem>? _inventoryItems;
  UserResponse? _currentUser;

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
      final dio = _auth.buildDio(baseUrl: apiBaseUrl);
      final client = ApiClient.fromDio(dio);
      _client = client;

      final marketplaceApi = MarketplaceApi(client: client);
      final inventoryApi = InventoryApi(client: client);
      final userService = UserService(client: client);

      final items = await marketplaceApi.getSummary();
      final inventoryItems = await inventoryApi.getInventory();
      final currentUser = await userService.getMe();

      setState(() {
        _items = items;
        _inventoryItems = inventoryItems;
        _currentUser = currentUser;
      });
    } catch (e) {
      print(e);
      setState(() {
        _error = e.toString();
      });
    } finally {
      setState(() {
        _loading = false;
      });
    }
  }
    Future<void> _reload() async {
    setState(() {
      _loading = true;
      _error = null;
    });

    try {
      final dio = _auth.buildDio(baseUrl: apiBaseUrl);
      final client = ApiClient.fromDio(dio);
      _client = client;

      final marketplaceApi = MarketplaceApi(client: client);
      final inventoryApi = InventoryApi(client: client);
      final userService = UserService(client: client);

      final items = await marketplaceApi.getSummary();
      final inventoryItems = await inventoryApi.getInventory();
      final currentUser = await userService.getMe();

      setState(() {
        _items = items;
        _inventoryItems = inventoryItems;
        _currentUser = currentUser;
      });
    } catch (e) {
      print(e);
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
    if (_loading) {
      return const Center(child: CircularProgressIndicator());
    }

    if (_items == null || _client == null || _currentUser == null) {
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
              child: const Text('Login with Auth0', style: TextStyle(fontSize: 15),),
              
            ),
          ],
        ),
      );
    }

    switch (_selectedIndex) {
      case 0:
        return MarketplacePage(
          items: _items!,
          currentUser: _currentUser!,
          client: _client!,
          onRefreshRequested: _reload,
        );
      case 1:
        return InventoryPage(
          inventoryItems: _inventoryItems!,
          client: _client!,
          currentUser: _currentUser!,
        );
      case 2:     //profile egyszercsak
        return ProfilePage(
          currentUser: _currentUser!,
        );
      default:
        return MarketplacePage(
          items: _items!,
          currentUser: _currentUser!,
          client: _client!,
        );
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
