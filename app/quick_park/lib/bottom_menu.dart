import 'package:flutter/material.dart';
import 'profile.dart';
import 'wallet_page.dart';
import 'reservation_history.dart'; // Import the ReservationHistoryPage

class BottomMenu extends StatefulWidget {
  const BottomMenu({super.key});

  @override
  _BottomMenuState createState() => _BottomMenuState();
}

class _BottomMenuState extends State<BottomMenu> {
  @override
  Widget build(BuildContext context) {
    return BottomAppBar(
      shape: const CircularNotchedRectangle(),
      notchMargin: 4.0, // Reduced notch margin
      child: Container(
        height: 48.0, // Reduced height for the bottom menu
        padding: const EdgeInsets.symmetric(horizontal: 16.0),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceAround,
          children: <Widget>[
            IconButton(
              icon: const Icon(Icons.person, size: 20), // Reduced icon size
              onPressed: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(builder: (context) => const ProfilePage()),
                );
              },
            ),
            IconButton(
              icon: const Icon(Icons.account_balance_wallet,
                  size: 20), // Reduced icon size
              onPressed: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(builder: (context) => const WalletPage()),
                );
              },
            ),
            IconButton(
              icon: const Icon(Icons.history, size: 20), // Reduced icon size
              onPressed: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(
                      builder: (context) => const ReservationHistoryPage()),
                );
              },
            ),
          ],
        ),
      ),
    );
  }
}
