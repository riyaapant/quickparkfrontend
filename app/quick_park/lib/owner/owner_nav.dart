import 'package:flutter/material.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'add_parking.dart'; // Import the add parking page
import 'view_parking.dart'; // Import the view parking page
import '../dashboard.dart'; // Import the user dashboard page
import '../services/api_service_owner.dart'; // Import the ApiServiceOwner
import '../login.dart'; // Import the Login page

class OwnerNavigationDrawer extends StatelessWidget {
  const OwnerNavigationDrawer({super.key});

  @override
  Widget build(BuildContext context) {
    final storage = const FlutterSecureStorage();

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
                'Owner Menu',
                style: TextStyle(
                  color: Colors.white,
                  fontSize: 24,
                ),
              ),
            ),
          ),
          ListTile(
            leading: const Icon(Icons.add),
            title: const Text('Add Parking'),
            onTap: () {
              Navigator.push(
                context,
                MaterialPageRoute(builder: (context) => const AddParkingPage()),
              );
            },
          ),
          const Divider(),
          ListTile(
            leading: const Icon(Icons.view_list),
            title: const Text('View Parking'),
            onTap: () {
              Navigator.push(
                context,
                MaterialPageRoute(
                    builder: (context) => const ViewParkingPage()),
              );
            },
          ),
          const Divider(),
          ListTile(
            leading: const Icon(Icons.logout),
            title: const Text('Logout'),
            onTap: () async {
              await storage.deleteAll(); // Clear all stored data
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
            title: const Text('User Mode'),
            onTap: () async {
              try {
                final response = await ApiServiceOwner.updateUserToOwnerMode();
                if (response.statusCode == 200) {
                  await storage.write(key: 'mode', value: 'user');
                  Navigator.pushAndRemoveUntil(
                    context,
                    MaterialPageRoute(
                        builder: (context) => const DashboardPage()),
                    (Route<dynamic> route) => false,
                  );
                } else {
                  // Handle error response
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(
                        content: Text('Failed to switch to user mode')),
                  );
                }
              } catch (e) {
                // Handle exception
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(content: Text('Error: ${e.toString()}')),
                );
              }
            },
          ),
        ],
      ),
    );
  }
}
