import 'package:flutter/material.dart';

import 'services/api_service.dart';

class SignupPage extends StatefulWidget {
  const SignupPage({super.key});

  @override
  State<SignupPage> createState() => _SignupPageState();
}

class _SignupPageState extends State<SignupPage> {
  final TextEditingController firstNameController = TextEditingController();
  final TextEditingController lastNameController = TextEditingController();
  final TextEditingController addressController = TextEditingController();
  final TextEditingController contactNumberController = TextEditingController();
  final TextEditingController emailController = TextEditingController();
  final TextEditingController passwordController = TextEditingController();

  String firstNameErrorMessage = '';
  String lastNameErrorMessage = '';
  String addressErrorMessage = '';
  String contactNumberErrorMessage = '';
  String vehicleNumberErrorMessage = '';
  String emailErrorMessage = '';
  String passwordErrorMessage = '';
  bool isLoading = false;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('QuickPark - Sign Up'),
      ),
      body: SingleChildScrollView(
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: <Widget>[
              const SizedBox(height: 16.0),
              TextField(
                controller: firstNameController,
                decoration: InputDecoration(
                  labelText: 'First Name',
                  prefixIcon: const Icon(Icons.person),
                  errorText: firstNameErrorMessage.isNotEmpty
                      ? firstNameErrorMessage
                      : null,
                ),
              ),
              const SizedBox(height: 16.0),
              TextField(
                controller: lastNameController,
                decoration: InputDecoration(
                  labelText: 'Last Name',
                  prefixIcon: const Icon(Icons.person),
                  errorText: lastNameErrorMessage.isNotEmpty
                      ? lastNameErrorMessage
                      : null,
                ),
              ),
              const SizedBox(height: 16.0),
              TextField(
                controller: addressController,
                decoration: InputDecoration(
                  labelText: 'Address',
                  prefixIcon: const Icon(Icons.location_city),
                  errorText: addressErrorMessage.isNotEmpty
                      ? addressErrorMessage
                      : null,
                ),
              ),
              const SizedBox(height: 16.0),
              TextField(
                controller: contactNumberController,
                decoration: InputDecoration(
                  labelText: 'Contact Number',
                  prefixIcon: const Icon(Icons.phone),
                  errorText: contactNumberErrorMessage.isNotEmpty
                      ? contactNumberErrorMessage
                      : null,
                ),
                keyboardType: TextInputType.phone,
              ),
              const SizedBox(height: 16.0),
              TextField(
                controller: emailController,
                decoration: InputDecoration(
                  labelText: 'Email',
                  prefixIcon: const Icon(Icons.email),
                  errorText:
                      emailErrorMessage.isNotEmpty ? emailErrorMessage : null,
                ),
              ),
              const SizedBox(height: 16.0),
              TextField(
                controller: passwordController,
                decoration: InputDecoration(
                  labelText: 'Password',
                  prefixIcon: const Icon(Icons.lock),
                  errorText: passwordErrorMessage.isNotEmpty
                      ? passwordErrorMessage
                      : null,
                ),
                obscureText: true,
              ),
              const SizedBox(height: 16.0),
              ElevatedButton(
                onPressed: isLoading
                    ? null
                    : () async {
                        // Reset existing error messages
                        setState(() {
                          firstNameErrorMessage = '';
                          lastNameErrorMessage = '';
                          addressErrorMessage = '';
                          contactNumberErrorMessage = '';
                          emailErrorMessage = '';
                          passwordErrorMessage = '';
                          isLoading = true;
                        });

                        // Perform input field validation
                        if (firstNameController.text.isEmpty) {
                          setState(() {
                            firstNameErrorMessage = 'First Name is required';
                            isLoading = false;
                          });
                          return;
                        }

                        if (lastNameController.text.isEmpty) {
                          setState(() {
                            lastNameErrorMessage = 'Last Name is required';
                            isLoading = false;
                          });
                          return;
                        }

                        if (addressController.text.isEmpty) {
                          setState(() {
                            addressErrorMessage = 'Address is required';
                            isLoading = false;
                          });
                          return;
                        }

                        if (contactNumberController.text.isEmpty) {
                          setState(() {
                            contactNumberErrorMessage =
                                'Contact Number is required';
                            isLoading = false;
                          });
                          return;
                        }

                        //Contact number validation
                        const contactNumberPattern =
                            r'^(?:\(?\+977\)?)?[9][6-9]\d{8}|01[-]?[0-9]{7}/';
                        final contactNumberRegExp =
                            RegExp(contactNumberPattern);
                        if (!contactNumberRegExp
                            .hasMatch(contactNumberController.text)) {
                          setState(() {
                            contactNumberErrorMessage =
                                'Invalid contact number format';
                            isLoading = false;
                          });
                          return;
                        }

                        if (emailController.text.isEmpty) {
                          setState(() {
                            emailErrorMessage = 'Email is required';
                            isLoading = false;
                          });
                          return;
                        }

                        //Email validation
                        const emailPattern =
                            r'^[\w-]+(\.[\w-]+)*@([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,7}$';
                        final emailRegExp = RegExp(emailPattern);
                        if (!emailRegExp.hasMatch(emailController.text)) {
                          setState(() {
                            emailErrorMessage = 'Invalid email format';
                            isLoading = false;
                          });
                          return;
                        }

                        if (passwordController.text.isEmpty) {
                          setState(() {
                            passwordErrorMessage = 'Password is required';
                            isLoading = false;
                          });
                          return;
                        }

                        if (passwordController.text.length < 6) {
                          setState(() {
                            passwordErrorMessage =
                                'Password must be at least 6 characters long';
                            isLoading = false;
                          });
                          return;
                        }
                        // Prepare the signup data
                        var signupData = {
                          'email': emailController.text,
                          'first_name': firstNameController.text,
                          'last_name': lastNameController.text,
                          'address': addressController.text,
                          'contact': contactNumberController.text,
                          'password': passwordController.text,
                        };

                        // Send a POST request to ApiService
                        var response =
                            await ApiService.post('/register', signupData);

                        // Check the response status
                        if (response.statusCode == 201) {
                          // Signup successful
                          showDialog(
                            context: context,
                            builder: (BuildContext context) {
                              return AlertDialog(
                                title: const Text('Verification Link Sent'),
                                content: const Text(
                                    'A verification link has been sent to your email.'),
                                actions: [
                                  TextButton(
                                    child: const Text('OK'),
                                    onPressed: () {
                                      Navigator.pop(context);
                                      Navigator.pop(
                                          context); // Close the dialog
                                    },
                                  ),
                                ],
                              );
                            },
                          );
                        } else {
                          // Signup failed
                          showDialog(
                            context: context,
                            builder: (BuildContext context) {
                              return AlertDialog(
                                title: const Text('Sign Up Failed'),
                                content: const Text(
                                    'There was an error during sign up. Please try again.'),
                                actions: [
                                  TextButton(
                                    child: const Text('OK'),
                                    onPressed: () {
                                      Navigator.pop(
                                          context); // Close the dialog
                                    },
                                  ),
                                ],
                              );
                            },
                          );
                        }
                      },
                child: isLoading
                    ? const CircularProgressIndicator()
                    : const Text('Sign Up'),
              ),
              TextButton(
                child: const Text('Already have an account? Sign In'),
                onPressed: () {
                  Navigator.pop(context);
                },
              ),
            ],
          ),
        ),
      ),
    );
  }
}
