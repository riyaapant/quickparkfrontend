import 'package:http/http.dart' as http;
import 'dart:convert';
import 'dart:io';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:http/http.dart';

class ApiServiceOwner {
  static const String _baseUrl = 'http://10.0.2.2:2564';

  // Method to update user to owner mode
  static Future<http.Response> updateUserToOwnerMode() async {
    final url = Uri.parse('$_baseUrl/update');
    const storage = FlutterSecureStorage();
    final accessToken = await storage.read(key: 'access_token');

    if (accessToken == null) {
      throw Exception('Access token is missing');
    }

    final response = await _getWithTokenRefresh(url);

    if (response.statusCode != 200) {
      throw Exception('Failed to update user to owner mode');
    }

    return response;
  }

  // Method to handle GET requests with token refresh
  static Future<http.Response> _getWithTokenRefresh(Uri url) async {
    const storage = FlutterSecureStorage();
    String? accessToken = await storage.read(key: 'access_token');

    http.Response response = await http.get(
      url,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $accessToken',
      },
    );

    if (response.statusCode == 401) {
      // Token might be expired, try to refresh it
      bool tokenRefreshed = await refreshToken();
      if (tokenRefreshed) {
        accessToken = await storage.read(key: 'access_token');
        response = await http.get(
          url,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer $accessToken',
          },
        );
      }
    }

    return response;
  }

  // Method to refresh the access token
  static Future<bool> refreshToken() async {
    const storage = FlutterSecureStorage();
    final refreshToken = await storage.read(key: 'refresh_token');

    if (refreshToken == null) {
      return false;
    }

    final url = Uri.parse('$_baseUrl/api/token/refresh');
    final response = await http.post(
      url,
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({'refresh': refreshToken}),
    );

    if (response.statusCode == 200) {
      var tokenData = jsonDecode(response.body);
      var newAccessToken = tokenData['access'];
      await storage.write(key: 'access_token', value: newAccessToken);
      return true;
    } else {
      return false;
    }
  }

  // Method to add parking
  static Future<http.Response> addParking(
      Map<String, String> parkingData, File file) async {
    final url = Uri.parse('$_baseUrl/addparking');
    const storage = FlutterSecureStorage();
    final accessToken = await storage.read(key: 'access_token');

    if (accessToken == null) {
      throw Exception('Access token is missing');
    }

    final request = http.MultipartRequest('POST', url)
      ..headers['Authorization'] = 'Bearer $accessToken'
      ..fields.addAll(parkingData)
      ..files.add(await http.MultipartFile.fromPath('file', file.path));

    final response = await request.send();

    if (response.statusCode == 401) {
      bool tokenRefreshed = await refreshToken();
      if (tokenRefreshed) {
        final newAccessToken = await storage.read(key: 'access_token');
        if (newAccessToken != null) {
          final newRequest = http.MultipartRequest('POST', url)
            ..headers['Authorization'] = 'Bearer $newAccessToken'
            ..fields.addAll(parkingData)
            ..files.add(await http.MultipartFile.fromPath('file', file.path));
          return await http.Response.fromStream(await newRequest.send());
        }
      }
    }

    return await http.Response.fromStream(response);
  }

  // Method to view parking locations
  static Future<http.Response> viewParkingLocations() async {
    final url = Uri.parse('$_baseUrl/viewownparking');
    const storage = FlutterSecureStorage();
    final accessToken = await storage.read(key: 'access_token');

    if (accessToken == null) {
      throw Exception('Access token is missing');
    }

    final response = await _getWithTokenRefresh(url);

    if (response.statusCode != 200) {
      throw Exception('Failed to load parking locations');
    }

    return response;
  }
}
