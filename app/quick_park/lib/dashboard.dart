import 'package:flutter/material.dart';
import 'login.dart';

class DashboardPage extends StatefulWidget {
  @override
  _DashboardPageState createState() => _DashboardPageState();
}

class _DashboardPageState extends State<DashboardPage> {
  bool _isNavMenuOpen = false;

  void _toggleNavMenu() {
    setState(() {
      _isNavMenuOpen = !_isNavMenuOpen;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Dashboard'),
        leading: IconButton(
          icon: Icon(Icons.menu),
          onPressed: _toggleNavMenu,
        ),
      ),
      body: Stack(
        children: [
          if (_isNavMenuOpen)
            Positioned.fill(
              child: Container(
                color: Theme.of(context)
                    .primaryColor, // Match the theme of LoginPage
              ),
            ),
          Row(
            children: [
              if (_isNavMenuOpen) NavigationPanel(), // Left Navigation Panel
              Expanded(
                child: Container(
                  padding: EdgeInsets.all(16.0),
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Text(
                        'Profile Information',
                        style: TextStyle(
                          fontSize: 24.0,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      SizedBox(height: 16.0),
                      // Add your profile information widgets here
                    ],
                  ),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}

class NavigationPanel extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Container(
      width: 200.0,
      color: Theme.of(context).primaryColor, // Match the theme of LoginPage
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          ListTile(
            leading: Icon(Icons.person, color: Colors.white),
            title: Text('Profile', style: TextStyle(color: Colors.white)),
            onTap: () {
              // Handle profile navigation
            },
          ),
          ListTile(
            leading: Icon(Icons.settings, color: Colors.white),
            title: Text('Settings', style: TextStyle(color: Colors.white)),
            onTap: () {
              // Handle settings navigation
            },
          ),
          ListTile(
            leading: Icon(Icons.logout, color: Colors.white),
            title: Text('Logout', style: TextStyle(color: Colors.white)),
            onTap: () {
              Navigator.pushAndRemoveUntil(
                context,
                MaterialPageRoute(builder: (context) => LoginPage()),
                (Route<dynamic> route) => false,
              );
            },
          ),
        ],
      ),
    );
  }
}
