// owner_dashboard.dart
import 'package:flutter/material.dart';
import 'owner_nav.dart'; // Import the owner navigation drawer

class OwnerDashboardPage extends StatelessWidget {
  const OwnerDashboardPage({super.key});

  @override
  Widget build(BuildContext context) {
    return WillPopScope(
      onWillPop: () async {
        // Prevent going back to the login page
        return false;
      },
      child: Scaffold(
        appBar: AppBar(
          title: const Text('Owner Dashboard'),
        ),
        drawer:
            const OwnerNavigationDrawer(), // Use the owner navigation drawer
        body: const Center(
          child: Text('Welcome to Owner Dashboard!'),
        ),
      ),
    );
  }
}
