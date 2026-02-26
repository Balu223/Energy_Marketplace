import 'package:energy_marketplace_mobile/data/notifiers.dart';
import 'package:energy_marketplace_mobile/views/pages/homepage.dart';
import 'package:energy_marketplace_mobile/views/pages/profilepage.dart';
import 'package:energy_marketplace_mobile/widgets/navbar_widget.dart';
import 'package:flutter/material.dart';

List<Widget> pages = [HomePage(), ProfilePage()];

class WidgetTree extends StatelessWidget {
  const WidgetTree({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        appBar: AppBar(title: Text('Energy Marketplace'), 
        centerTitle: true,
        actions: [
          IconButton(onPressed: () {
            isDarkModeNotifier.value = !isDarkModeNotifier.value;
          }, icon: ValueListenableBuilder(valueListenable: isDarkModeNotifier, builder: (context, isDarkMode, child) {
            return Icon(
              isDarkMode ? Icons.dark_mode : Icons.light_mode
            );
          },))
        ],
          
        ),
        body: ValueListenableBuilder(valueListenable: selectedPageNotifier, builder: (context, selectedPage, child) {
          return pages.elementAt(selectedPage);
        },),
        bottomNavigationBar: NavbarWidget()
      );
  }
}