import 'package:flutter/material.dart';
import 'package:khalti_flutter/khalti_flutter.dart';
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
    return KhaltiScope(
      publicKey: 'khalti key',
      enabledDebugging: true,
      builder: (context, navigatorKey) {
        return MaterialApp(
          navigatorKey: navigatorKey,
          title: 'QuickPark',
          theme: ThemeData(
            primarySwatch: Colors.blue,
          ),
          home: FutureBuilder<Map<String, dynamic>>(
            future: _checkTokenAndMode(),
            builder: (context, snapshot) {
              if (snapshot.connectionState == ConnectionState.waiting) {
                return const Scaffold(
                  body: Center(
                    child: CircularProgressIndicator(),
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
          localizationsDelegates: const [
            KhaltiLocalizations.delegate,
          ],
          supportedLocales: const [
            Locale('en', 'US'),
            Locale('ne', 'NP'),
          ],
        );
      },
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
