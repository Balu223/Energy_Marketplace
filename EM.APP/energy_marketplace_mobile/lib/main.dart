import 'package:energy_marketplace_mobile/features/dashboard/root_page.dart';
import 'package:flutter/material.dart';

void main() {
  runApp(const EnergyMarketplaceApp());
}

class EnergyMarketplaceApp extends StatelessWidget {
  const EnergyMarketplaceApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Energy Marketplace',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        brightness: Brightness.dark,
        colorScheme: const ColorScheme.dark(
          primary: Color(0xFFF15A29),
          secondary: Color(0xFFF15A29),
        ),
        scaffoldBackgroundColor: const Color(0xFF0E1117),
        appBarTheme: const AppBarTheme(
          backgroundColor: Color(0xFF161B22),
          foregroundColor: Colors.white,
          elevation: 0,
        ),
      ),
      home: const RootPage(),
    );
  }
}