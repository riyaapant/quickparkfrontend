import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import 'services/api_service.dart';
import 'dart:convert';
import 'dart:io';

class ProfilePage extends StatefulWidget {
  const ProfilePage({super.key});

  @override
  State<ProfilePage> createState() => _ProfilePageState();
}

class _ProfilePageState extends State<ProfilePage> {
  // Profile information
  String firstName = '';
  String lastName = '';
  String address = '';
  String contactNumber = '';
  String email = '';
  String profilePictureUrl = '';
  String vehicleId = '';

  bool isLoading = true;
  String errorMessage = '';

  @override
  void initState() {
    super.initState();
    fetchProfile();
    fetchProfilePicture();
  }

  Future<void> fetchProfile() async {
    try {
      final response = await ApiService.getProfile();
      final profileData = jsonDecode(response.body);
      setState(() {
        firstName = profileData['firstName'] ?? '';
        lastName = profileData['lastName'] ?? '';
        address = profileData['address'] ?? '';
        contactNumber = profileData['contact'] ?? '';
        email = profileData['email'] ?? '';
        profilePictureUrl = profileData['profile'] ?? '';
        vehicleId = profileData['vehicleId'] ?? '';
        isLoading = false;
      });
    } catch (e) {
      setState(() {
        errorMessage = e.toString();
        isLoading = false;
      });
    }
  }

  Future<void> fetchProfilePicture() async {
    try {
      final response = await ApiService.getProfile();
      final profileData = jsonDecode(response.body);
      setState(() {
        profilePictureUrl = profileData['profile'] ?? '';
      });
    } catch (e) {
      setState(() {
        errorMessage = e.toString();
      });
    }
  }

  Future<void> uploadProfilePicture(File imageFile) async {
    try {
      final response = await ApiService.uploadProfilePicture(imageFile);
      if (response.statusCode == 200) {
        fetchProfilePicture();
      } else {
        setState(() {
          errorMessage = 'Failed to upload profile picture';
        });
      }
    } catch (e) {
      setState(() {
        errorMessage = e.toString();
      });
    }
  }

  Future<void> pickImage() async {
    final picker = ImagePicker();
    final pickedFile = await picker.pickImage(source: ImageSource.gallery);

    if (pickedFile != null) {
      final imageFile = File(pickedFile.path);
      await uploadProfilePicture(imageFile);
    }
  }

  Future<void> updateVehicleId(String newVehicleId) async {
    try {
      final response = await ApiService.updateVehicleId(newVehicleId);
      if (response.statusCode == 200) {
        setState(() {
          vehicleId = newVehicleId;
        });
      } else {
        setState(() {
          errorMessage = 'Failed to update vehicle ID';
        });
      }
    } catch (e) {
      setState(() {
        errorMessage = e.toString();
      });
    }
  }

  Future<void> showUpdateVehicleIdDialog() async {
    final _formKey = GlobalKey<FormState>();
    TextEditingController vehicleIdController = TextEditingController();

    return showDialog<void>(
      context: context,
      barrierDismissible: false, // user must tap button!
      builder: (BuildContext context) {
        return AlertDialog(
          title: Text('Update Vehicle ID'),
          content: SingleChildScrollView(
            child: Form(
              key: _formKey,
              child: ListBody(
                children: <Widget>[
                  Text('Enter new Vehicle ID:'),
                  TextFormField(
                    controller: vehicleIdController,
                    validator: (value) {
                      if (value == null || value.isEmpty) {
                        return 'Please enter a vehicle ID';
                      }
                      final regex = RegExp(r'^B[A-Z]{2}\d{4}$');
                      if (!regex.hasMatch(value)) {
                        return 'Invalid vehicle ID';
                      }
                      return null;
                    },
                  ),
                ],
              ),
            ),
          ),
          actions: <Widget>[
            TextButton(
              child: Text('Cancel'),
              onPressed: () {
                Navigator.of(context).pop();
              },
            ),
            TextButton(
              child: Text('Update'),
              onPressed: () {
                if (_formKey.currentState?.validate() ?? false) {
                  final newVehicleId = vehicleIdController.text;
                  updateVehicleId(newVehicleId);
                  Navigator.of(context).pop();
                }
              },
            ),
          ],
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Profile'),
      ),
      body: isLoading
          ? const Center(child: CircularProgressIndicator())
          : errorMessage.isNotEmpty
              ? Center(child: Text(errorMessage))
              : SingleChildScrollView(
                  child: Padding(
                    padding: const EdgeInsets.all(16.0),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Center(
                          child: CircleAvatar(
                            radius: 50,
                            backgroundImage: profilePictureUrl.isNotEmpty
                                ? NetworkImage(profilePictureUrl)
                                : null,
                            child: profilePictureUrl.isEmpty
                                ? const Icon(Icons.person, size: 50)
                                : null,
                          ),
                        ),
                        const SizedBox(height: 10),
                        Center(
                          child: ElevatedButton(
                            onPressed: pickImage,
                            child: const Text('Upload Picture'),
                          ),
                        ),
                        const SizedBox(height: 20),
                        const Text(
                          'First Name:',
                          style: TextStyle(
                              fontSize: 18, fontWeight: FontWeight.bold),
                        ),
                        const SizedBox(height: 5),
                        Text(
                          firstName,
                          style: const TextStyle(fontSize: 16),
                        ),
                        const SizedBox(height: 10),
                        const Text(
                          'Last Name:',
                          style: TextStyle(
                              fontSize: 18, fontWeight: FontWeight.bold),
                        ),
                        const SizedBox(height: 5),
                        Text(
                          lastName,
                          style: const TextStyle(fontSize: 16),
                        ),
                        const SizedBox(height: 10),
                        const Text(
                          'Address:',
                          style: TextStyle(
                              fontSize: 18, fontWeight: FontWeight.bold),
                        ),
                        const SizedBox(height: 5),
                        Text(
                          address,
                          style: const TextStyle(fontSize: 16),
                        ),
                        const SizedBox(height: 10),
                        const Text(
                          'Contact Number:',
                          style: TextStyle(
                              fontSize: 18, fontWeight: FontWeight.bold),
                        ),
                        const SizedBox(height: 5),
                        Text(
                          contactNumber,
                          style: const TextStyle(fontSize: 16),
                        ),
                        const SizedBox(height: 10),
                        const Text(
                          'Email:',
                          style: TextStyle(
                              fontSize: 18, fontWeight: FontWeight.bold),
                        ),
                        const SizedBox(height: 5),
                        Text(
                          email,
                          style: const TextStyle(fontSize: 16),
                        ),
                        const SizedBox(height: 10),
                        const Text(
                          'Vehicle ID:',
                          style: TextStyle(
                              fontSize: 18, fontWeight: FontWeight.bold),
                        ),
                        const SizedBox(height: 5),
                        Text(
                          vehicleId.isNotEmpty ? vehicleId : 'Not set',
                          style: const TextStyle(fontSize: 16),
                        ),
                        const SizedBox(height: 10),
                        Center(
                          child: ElevatedButton(
                            onPressed: showUpdateVehicleIdDialog,
                            child: const Text('Update Vehicle ID'),
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
    );
  }
}
