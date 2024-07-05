import 'package:flutter/material.dart';
import 'owner_nav.dart'; // Import the owner navigation drawer
import 'revenue.dart'; // Import the revenue card
import 'parking.dart'; // Import the parking card

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
          title: Padding(
            padding: const EdgeInsets.only(top: 16.0), // Add top margin
            child: Image.asset(
              'assets/images/logo.png', // Path to your logo
              height: 150, // Adjust the height as needed
            ),
          ),
        ),
        drawer:
            const OwnerNavigationDrawer(), // Use the owner navigation drawer
        body: SingleChildScrollView(
          child: Column(
            children: [
              const RevenueCard(),
              const ParkingCard(), // Add the parking card
            ],
          ),
        ),
      ),
    );
  }
}
