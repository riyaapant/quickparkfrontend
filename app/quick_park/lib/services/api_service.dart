import 'package:http/http.dart' as http;
import 'dart:convert';
import 'dart:io';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:jwt_decode/jwt_decode.dart';

class ApiService {
  static const String _baseUrl = 'http://10.0.2.2:2564';

  // Method to make a POST request
  static Future<http.Response> post(
      String endpoint, Map<String, dynamic> data) {
    final url = Uri.parse('$_baseUrl$endpoint');
    return http.post(
      url,
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode(data),
    );
  }

  // Method to make a GET request with access token in header
  static Future<http.Response> getProfile() async {
    final url = Uri.parse('$_baseUrl/profile');
    const storage = FlutterSecureStorage();
    final accessToken = await storage.read(key: 'access_token');

    if (accessToken == null) {
      throw Exception('Access token is missing');
    }

    final response = await _getWithTokenRefresh(url);

    if (response.statusCode != 200) {
      throw Exception('Failed to load profile information');
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
      bool tokenRefreshed = await _refreshToken();
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
  static Future<bool> _refreshToken() async {
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

  // Method to check token validity using JWT decoder
  static bool isTokenValid(String token) {
    try {
      Map<String, dynamic> payload = Jwt.parseJwt(token);
      DateTime expiryDate = Jwt.getExpiryDate(token)!;
      return DateTime.now().isBefore(expiryDate);
    } catch (e) {
      return false;
    }
  }

  // Method to refresh the access token (public)
  static Future<bool> refreshToken(String refreshToken) async {
    const storage = FlutterSecureStorage();
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

  // Method to upload profile picture
  static Future<http.Response> uploadProfilePicture(File imageFile) async {
    final url = Uri.parse('$_baseUrl/upload/image');
    const storage = FlutterSecureStorage();
    final accessToken = await storage.read(key: 'access_token');

    if (accessToken == null) {
      throw Exception('Access token is missing');
    }

    final request = http.MultipartRequest('PUT', url)
      ..headers['Authorization'] = 'Bearer $accessToken'
      ..files.add(await http.MultipartFile.fromPath('profile', imageFile.path));

    var response = await http.Response.fromStream(await request.send());

    if (response.statusCode == 401) {
      // Token might be expired, try to refresh it
      bool tokenRefreshed = await _refreshToken();
      if (tokenRefreshed) {
        final newAccessToken = await storage.read(key: 'access_token');
        final request = http.MultipartRequest('PUT', url)
          ..headers['Authorization'] = 'Bearer $newAccessToken'
          ..files.add(
              await http.MultipartFile.fromPath('profile', imageFile.path));

        response = await http.Response.fromStream(await request.send());
      } else {
        throw Exception('Failed to refresh token');
      }
    }

    if (response.statusCode != 200) {
      throw Exception('Failed to upload profile picture');
    }

    return response;
  }

  // Method to upload PDF document
  static Future<http.Response> uploadPdf(File pdfFile) async {
    final url = Uri.parse('$_baseUrl/upload/customer/file');
    const storage = FlutterSecureStorage();
    final accessToken = await storage.read(key: 'access_token');

    if (accessToken == null) {
      throw Exception('Access token is missing');
    }

    final request = http.MultipartRequest('PUT', url)
      ..headers['Authorization'] = 'Bearer $accessToken'
      ..files.add(await http.MultipartFile.fromPath('file', pdfFile.path));

    var response = await http.Response.fromStream(await request.send());

    if (response.statusCode == 401) {
      // Token might be expired, try to refresh it
      bool tokenRefreshed = await _refreshToken();
      if (tokenRefreshed) {
        final newAccessToken = await storage.read(key: 'access_token');
        final request = http.MultipartRequest('PUT', url)
          ..headers['Authorization'] = 'Bearer $newAccessToken'
          ..files.add(await http.MultipartFile.fromPath('file', pdfFile.path));

        response = await http.Response.fromStream(await request.send());
      } else {
        throw Exception('Failed to refresh token');
      }
    }

    if (response.statusCode != 200) {
      throw Exception('Failed to upload PDF');
    }

    return response;
  }

  // Method to get parking locations
  static Future<List<Map<String, dynamic>>> getParkingLocations() async {
    final url = Uri.parse('$_baseUrl/viewparkinglocations');
    const storage = FlutterSecureStorage();
    final accessToken = await storage.read(key: 'access_token');

    if (accessToken == null) {
      throw Exception('Access token is missing');
    }

    final response = await _getWithTokenRefresh(url);

    if (response.statusCode == 200) {
      List<dynamic> data = jsonDecode(response.body);
      return data.map((item) => item as Map<String, dynamic>).toList();
    } else {
      throw Exception('Failed to load parking locations');
    }
  }

  // Method to get parking location details by ID
  static Future<Map<String, dynamic>> getParkingLocationDetails(
      String id) async {
    final url = Uri.parse('$_baseUrl/viewparking/$id');
    const storage = FlutterSecureStorage();
    final accessToken = await storage.read(key: 'access_token');

    if (accessToken == null) {
      throw Exception('Access token is missing');
    }

    final response = await _getWithTokenRefresh(url);

    if (response.statusCode == 200) {
      return jsonDecode(response.body) as Map<String, dynamic>;
    } else {
      throw Exception('Failed to load parking location details');
    }
  }

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

  // Method to update vehicle ID
  static Future<http.Response> updateVehicleId(String vehicleId) async {
    final url = Uri.parse('$_baseUrl/vehicleid');
    const storage = FlutterSecureStorage();
    final accessToken = await storage.read(key: 'access_token');

    if (accessToken == null) {
      throw Exception('Access token is missing');
    }

    final response = await http.put(
      url,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $accessToken',
      },
      body: jsonEncode({'vehicle_id': vehicleId}),
    );

    if (response.statusCode != 200) {
      throw Exception('Failed to update vehicle ID');
    }

    return response;
  }

  /// Method to generate pidx for Khalti payment
  static Future<String?> generatePidx(int amount) async {
    const storage = FlutterSecureStorage();
    final accessToken = await storage.read(key: 'access_token');

    if (accessToken == null) {
      throw Exception('Access token is missing');
    }

    final url = Uri.parse('$_baseUrl/topup');
    final response = await http.post(
      url,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $accessToken',
      },
      body: jsonEncode({'amount': amount}),
    );

    if (response.statusCode == 200) {
      final responseData = jsonDecode(response.body);
      return responseData['pidx']; // Assumes the response contains the pidx
    } else {
      throw Exception('Failed to generate pidx');
    }
  }

  // Method to verify top-up using pidx
  static Future<bool> verifyTopUp(String pidx) async {
    const storage = FlutterSecureStorage();
    final accessToken = await storage.read(key: 'access_token');

    if (accessToken == null) {
      throw Exception('Access token is missing');
    }

    final url = Uri.parse('$_baseUrl/topup/verify');
    final response = await http.put(
      url,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $accessToken',
      },
      body: jsonEncode({'pidx': pidx}),
    );

    if (response.statusCode == 200) {
      return true;
    } else {
      return false;
    }
  }
}
