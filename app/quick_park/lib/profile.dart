import 'package:flutter/material.dart';

class ProfilePage extends StatelessWidget {
  // Profile information
  final firstName = 'Quick';
  final lastName = 'Park';
  final address = 'Kathmandu, Nepal';
  final contactNumber = '9800000000';
  final vehicleNumber = 'B AB1234';
  final email = 'quickpark@gmail.com';

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Profile'),
      ),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text('First Name: $firstName'),
            Text('Last Name: $lastName'),
            Text('Address: $address'),
            Text('Contact Number: $contactNumber'),
            Text('Vehicle Number: $vehicleNumber'),
            Text('Email: $email'),
            SizedBox(height: 20),
            ElevatedButton(
              onPressed: () {
                // edit profile functionality
              },
              child: Text('Edit Profile'),
            ),
          ],
        ),
      ),
    );
  }
}
