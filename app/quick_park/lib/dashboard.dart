import 'package:flutter/material.dart';
import 'dart:convert';
import 'profile.dart';
import 'services/api_service.dart';
import 'location_search.dart';
import 'nav.dart' as custom_nav;

class DashboardPage extends StatefulWidget {
  const DashboardPage({super.key});

  @override
  _DashboardPageState createState() => _DashboardPageState();
}

class _DashboardPageState extends State<DashboardPage> {
  String profilePictureUrl = '';
  bool isLoading = true;
  String errorMessage = '';

  @override
  void initState() {
    super.initState();
    fetchProfilePicture();
  }

  Future<void> fetchProfilePicture() async {
    try {
      final response = await ApiService.getProfile();
      final profileData = jsonDecode(response.body);
      setState(() {
        profilePictureUrl = profileData['profile'] ?? '';
        isLoading = false;
      });
    } catch (e) {
      setState(() {
        errorMessage = e.toString();
        isLoading = false;
      });
    }
  }

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
          actions: [
            if (isLoading)
              const Center(
                  child: CircularProgressIndicator(
                color: Color(0xFF275072), // Custom spinner color
              ))
            else if (errorMessage.isNotEmpty)
              Center(child: Text(errorMessage))
            else
              GestureDetector(
                onTap: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                        builder: (context) => const ProfilePage()),
                  );
                },
                child: CircleAvatar(
                  backgroundImage: profilePictureUrl.isNotEmpty
                      ? NetworkImage(profilePictureUrl)
                      : null,
                  child: profilePictureUrl.isEmpty
                      ? const Icon(Icons.person)
                      : null,
                ),
              ),
            const SizedBox(width: 16), // Adds some padding to the right side
          ],
        ),
        drawer: const custom_nav.NavigationDrawer(),
        body: const Column(
          children: [
            Expanded(
              child:
                  SlideUpPanel(), // Assuming this is your map or similar widget
            ),
          ],
        ),
      ),
    );
  }
}
