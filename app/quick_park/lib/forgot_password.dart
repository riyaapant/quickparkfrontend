import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

class ForgotPasswordPage extends StatefulWidget {
  const ForgotPasswordPage({super.key});

  @override
  State<ForgotPasswordPage> createState() => _ForgotPasswordPageState();
}

class _ForgotPasswordPageState extends State<ForgotPasswordPage> {
  final TextEditingController emailController = TextEditingController();
  String emailErrorMessage = '';
  bool isLoading = false;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('QuickPark'),
      ),
      body: SingleChildScrollView(
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: <Widget>[
              Image.asset(
                'assets/images/forgot_password.png',
                height: 200,
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
              ElevatedButton(
                onPressed: isLoading
                    ? null
                    : () async {
                        // Reset existing error messages
                        setState(() {
                          emailErrorMessage = '';
                          isLoading = true;
                        });

                        // Check if email field is empty
                        if (emailController.text.isEmpty) {
                          setState(() {
                            emailErrorMessage = 'Email is required';
                            isLoading = false;
                          });
                          return;
                        }

                        // Check if email has a valid format
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

                        // Prepare the reset password data
                        var resetPasswordData = {
                          'email': emailController.text,
                        };

                        // Send a POST request to the backend
                        var response = await http.post(
                          Uri.parse('http://110.44.121.73:2564/forgetpassword'),
                          headers: {'Content-Type': 'application/json'},
                          body: jsonEncode(resetPasswordData),
                        );

                        // Check the response status
                        if (response.statusCode == 200) {
                          showDialog(
                            context: context,
                            builder: (BuildContext context) {
                              return AlertDialog(
                                title: const Text('Verification Sent'),
                                content: const Text(
                                    'A verification email has been sent to your email address.'),
                                actions: <Widget>[
                                  TextButton(
                                    child: const Text('OK'),
                                    onPressed: () {
                                      Navigator.pop(context);
                                      Navigator.pop(context);
                                    },
                                  ),
                                ],
                              );
                            },
                          );
                          // Password reset request successful
                          // You can perform any necessary actions here, such as displaying a success message
                          // or navigating to a confirmation page
                        } else {
                          setState(() {
                            emailErrorMessage = 'Invalid email';
                            isLoading = false;
                          });
                          return;
                          // Password reset request failed
                          // You can handle the failure scenario here, such as displaying an error message
                        }
                      },
                child: isLoading
                    ? const CircularProgressIndicator()
                    : const Text('Reset Password'),
              ),
              TextButton(
                child: const Text('Back to Login'),
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
