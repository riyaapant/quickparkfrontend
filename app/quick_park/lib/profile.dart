import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import 'dart:convert';
import 'dart:io';
import 'services/api_service.dart';
import 'package:url_launcher/url_launcher.dart';

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
  String documentLink = '';

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
        documentLink = profileData['document'] ?? '';
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
      barrierDismissible: false,
      builder: (BuildContext context) {
        return AlertDialog(
          title: const Text('Update Vehicle ID'),
          content: SingleChildScrollView(
            child: Form(
              key: _formKey,
              child: ListBody(
                children: <Widget>[
                  TextFormField(
                    controller: vehicleIdController,
                    decoration:
                        const InputDecoration(labelText: 'New Vehicle ID'),
                    validator: (value) {
                      if (value == null || value.isEmpty) {
                        return 'Please enter a vehicle ID';
                      }
                      final regex = RegExp(r'^B[A-Z]{2}\d{4}$');
                      if (!regex.hasMatch(value)) {
                        return 'Invalid vehicle ID format';
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
              child: const Text('Cancel'),
              onPressed: () {
                Navigator.of(context).pop();
              },
            ),
            TextButton(
              child: const Text('Update'),
              onPressed: () async {
                if (_formKey.currentState?.validate() == true) {
                  try {
                    await updateVehicleId(vehicleIdController.text);
                    Navigator.of(context).pop();
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(
                          content: Text('Vehicle ID updated successfully')),
                    );
                  } catch (e) {
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(
                          content: Text(
                              'Failed to update Vehicle ID: ${e.toString()}')),
                    );
                  }
                }
              },
            ),
          ],
        );
      },
    );
  }

  Future<void> launchURL(String url) async {
    if (await canLaunch(url)) {
      await launch(url);
    } else {
      throw 'Could not launch $url';
    }
  }

  Future<void> showChangePasswordDialog() async {
    final _formKey = GlobalKey<FormState>();
    TextEditingController oldPasswordController = TextEditingController();
    TextEditingController newPasswordController = TextEditingController();
    TextEditingController confirmPasswordController = TextEditingController();

    return showDialog<void>(
      context: context,
      barrierDismissible: false,
      builder: (BuildContext context) {
        return AlertDialog(
          title: const Text('Change Password'),
          content: SingleChildScrollView(
            child: Form(
              key: _formKey,
              child: ListBody(
                children: <Widget>[
                  TextFormField(
                    controller: oldPasswordController,
                    obscureText: true,
                    decoration:
                        const InputDecoration(labelText: 'Old Password'),
                    validator: (value) {
                      if (value == null || value.isEmpty) {
                        return 'Please enter your old password';
                      }
                      return null;
                    },
                  ),
                  TextFormField(
                    controller: newPasswordController,
                    obscureText: true,
                    decoration:
                        const InputDecoration(labelText: 'New Password'),
                    validator: (value) {
                      if (value == null || value.isEmpty) {
                        return 'Please enter a new password';
                      }
                      if (value.length < 6) {
                        return 'Password must be at least 6 characters long';
                      }
                      return null;
                    },
                  ),
                  TextFormField(
                    controller: confirmPasswordController,
                    obscureText: true,
                    decoration: const InputDecoration(
                        labelText: 'Confirm New Password'),
                    validator: (value) {
                      if (value != newPasswordController.text) {
                        return 'Passwords do not match';
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
              child: const Text('Cancel'),
              onPressed: () {
                Navigator.of(context).pop();
              },
            ),
            TextButton(
              child: const Text('Change'),
              onPressed: () async {
                if (_formKey.currentState?.validate() == true) {
                  try {
                    await ApiService.changePassword(
                      oldPasswordController.text,
                      newPasswordController.text,
                    );
                    Navigator.of(context).pop();
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(
                          content: Text('Password changed successfully')),
                    );
                  } catch (e) {
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(
                          content: Text(
                              'Failed to change password: ${e.toString()}')),
                    );
                  }
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
                        buildSectionCard(
                          'Personal Information',
                          [
                            buildProfileField('First Name', firstName),
                            buildProfileField('Last Name', lastName),
                            buildProfileField('Address', address),
                            buildProfileField('Contact Number', contactNumber),
                            buildProfileField('Email', email),
                            const SizedBox(height: 10),
                            Center(
                              child: ElevatedButton(
                                onPressed: showChangePasswordDialog,
                                child: const Text('Change Password'),
                              ),
                            ),
                          ],
                          width: double.infinity,
                          minHeight: 200,
                        ),
                        const SizedBox(height: 20),
                        buildSectionCard(
                          'Vehicle Information',
                          [
                            buildProfileField('Vehicle ID',
                                vehicleId.isNotEmpty ? vehicleId : 'Not set'),
                            Center(
                              child: ElevatedButton(
                                onPressed: showUpdateVehicleIdDialog,
                                child: const Text('Update Vehicle ID'),
                              ),
                            ),
                          ],
                          width: double.infinity,
                        ),
                        const SizedBox(height: 20),
                        buildSectionCard(
                          'Document',
                          [
                            Center(
                              child: ElevatedButton(
                                onPressed: documentLink.isNotEmpty
                                    ? () {
                                        launchURL(documentLink);
                                      }
                                    : null,
                                child: const Text('Show Document'),
                              ),
                            ),
                          ],
                          width: double.infinity,
                        ),
                      ],
                    ),
                  ),
                ),
    );
  }

  Widget buildSectionCard(String title, List<Widget> content,
      {double minHeight = 150, double width = double.infinity}) {
    return Container(
      width: width,
      child: Card(
        elevation: 3,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(10),
        ),
        child: Container(
          constraints: BoxConstraints(minHeight: minHeight),
          padding: const EdgeInsets.all(16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                title,
                style: const TextStyle(
                  fontSize: 20,
                  fontWeight: FontWeight.bold,
                  color: Color(0xFF265073),
                ),
              ),
              const SizedBox(height: 10),
              ...content,
            ],
          ),
        ),
      ),
    );
  }

  Widget buildProfileField(String label, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8.0),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(
            label,
            style: const TextStyle(
              fontWeight: FontWeight.bold,
              fontSize: 16,
            ),
          ),
          Flexible(
            child: Text(
              value,
              style: const TextStyle(
                fontSize: 16,
              ),
              textAlign: TextAlign.right,
            ),
          ),
        ],
      ),
    );
  }
}
