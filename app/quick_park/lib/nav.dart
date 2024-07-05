// nav.dart
import 'package:flutter/material.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'login.dart';
import 'profile.dart';
import 'wallet_page.dart';
import 'owner/owner_dashboard.dart';
import 'services/api_service.dart'; // Import the ApiService
import 'reservation_history.dart'; // Import the ReservationHistoryPage

class NavigationDrawer extends StatefulWidget {
  const NavigationDrawer({super.key});

  @override
  _NavigationDrawerState createState() => _NavigationDrawerState();
}

class _NavigationDrawerState extends State<NavigationDrawer> {
  final storage = const FlutterSecureStorage();

  @override
  Widget build(BuildContext context) {
    return Drawer(
      child: Column(
        children: <Widget>[
          const DrawerHeader(
            decoration: BoxDecoration(
              color: Color(0xFF275072),
            ),
            child: Align(
              alignment: Alignment.bottomLeft,
              child: Text(
                'User Menu',
                style: TextStyle(
                  color: Colors.white,
                  fontSize: 24,
                ),
              ),
            ),
          ),
          ListTile(
            leading: const Icon(Icons.person),
            title: const Text('Profile'),
            onTap: () {
              Navigator.push(
                context,
                MaterialPageRoute(builder: (context) => const ProfilePage()),
              );
            },
          ),
          const Divider(),
          ListTile(
            leading: const Icon(Icons.account_balance_wallet),
            title: const Text('Wallet'),
            onTap: () {
              Navigator.push(
                context,
                MaterialPageRoute(builder: (context) => const WalletPage()),
              );
            },
          ),
          const Divider(),
          ListTile(
            leading: const Icon(Icons.history),
            title: const Text('Reservation History'),
            onTap: () {
              Navigator.push(
                context,
                MaterialPageRoute(
                    builder: (context) => const ReservationHistoryPage()),
              );
            },
          ),
          const Divider(),
          ListTile(
            leading: const Icon(Icons.logout),
            title: const Text('Logout'),
            onTap: () async {
              await storage.delete(key: 'access_token');
              await storage.delete(key: 'refresh_token');
              Navigator.pushAndRemoveUntil(
                context,
                MaterialPageRoute(builder: (context) => const LoginPage()),
                (Route<dynamic> route) => false,
              );
            },
          ),
          const Divider(),
          ListTile(
            leading: const Icon(Icons.switch_account),
            title: const Text('Owner Mode'),
            onTap: () async {
              try {
                final response = await ApiService.updateUserToOwnerMode();
                if (response.statusCode == 200) {
                  await storage.write(key: 'mode', value: 'owner');
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (context) => const OwnerDashboardPage(),
                    ),
                  );
                } else {
                  // Handle errors or show a message to the user
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(
                        content: Text('Failed to switch to Owner Mode')),
                  );
                }
              } catch (e) {
                // Handle errors or show a message to the user
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(content: Text('Error: $e')),
                );
              }
            },
          ),
        ],
      ),
    );
  }
}
