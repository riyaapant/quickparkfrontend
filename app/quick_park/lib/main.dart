import 'package:flutter/material.dart';
import 'login.dart';
import 'dashboard.dart';
import 'document.dart';
import 'services/api_service.dart';
import 'owner/owner_dashboard.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'dart:convert';

void main() => runApp(const QuickPark());

class QuickPark extends StatelessWidget {
  const QuickPark({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'QuickPark',
      theme: ThemeData(
        primarySwatch: Colors.blue,
        textButtonTheme: TextButtonThemeData(
          style: TextButton.styleFrom(
            foregroundColor: Color(0xFF275072), // Custom button text color
          ),
        ),
        elevatedButtonTheme: ElevatedButtonThemeData(
          style: ElevatedButton.styleFrom(
            foregroundColor: Color(0xFF275072), // Custom button text color
          ),
        ),
        outlinedButtonTheme: OutlinedButtonThemeData(
          style: OutlinedButton.styleFrom(
            foregroundColor: Color(0xFF275072), // Custom button text color
          ),
        ),
        inputDecorationTheme: InputDecorationTheme(
          focusedBorder: UnderlineInputBorder(
            borderSide: BorderSide(
                color: Color(0xFF275072)), // Border color when focused
          ),
          enabledBorder: UnderlineInputBorder(
            borderSide: BorderSide(
                color: Colors.grey), // Default border color when enabled
          ),
          labelStyle: TextStyle(color: Colors.grey), // Default label color
          floatingLabelStyle:
              TextStyle(color: Color(0xFF275072)), // Label color when focused
        ),
      ),
      home: FutureBuilder<Map<String, dynamic>>(
        future: _checkTokenAndMode(),
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return Scaffold(
              body: Center(
                child: CircularProgressIndicator(
                  color: Color(0xFF275072), // Custom spinner color
                ),
              ),
            );
          } else if (snapshot.hasData && snapshot.data!['isValid']) {
            if (snapshot.data!['mode'] == 'owner') {
              return const OwnerDashboardPage();
            } else if (snapshot.data!['document'] == null) {
              return const DocumentPage();
            } else {
              return const DashboardPage();
            }
          } else {
            return const LoginPage();
          }
        },
      ),
    );
  }
}

Future<Map<String, dynamic>> _checkTokenAndMode() async {
  const storage = FlutterSecureStorage();
  final accessToken = await storage.read(key: 'access_token');
  final refreshToken = await storage.read(key: 'refresh_token');
  final mode = await storage.read(key: 'mode') ??
      'user'; // Default to 'user' mode if not set

  if (accessToken == null || refreshToken == null) {
    return {'isValid': false};
  }

  bool isTokenValid = ApiService.isTokenValid(accessToken);

  if (!isTokenValid) {
    isTokenValid = await ApiService.refreshToken(refreshToken);
  }

  if (isTokenValid) {
    final profileResponse = await ApiService.getProfile();
    if (profileResponse.statusCode == 200) {
      final profileData = jsonDecode(profileResponse.body);
      return {
        'isValid': true,
        'document': profileData['document'],
        'mode': mode
      };
    }
  }

  return {'isValid': false};
}
