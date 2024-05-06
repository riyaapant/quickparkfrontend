import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

class ForgotPasswordPage extends StatefulWidget {
  @override
  _ForgotPasswordPageState createState() => _ForgotPasswordPageState();
}

class _ForgotPasswordPageState extends State<ForgotPasswordPage> {
  final TextEditingController emailController = TextEditingController();
  String emailErrorMessage = '';
  bool isLoading = false;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('QuickPark'),
      ),
      body: SingleChildScrollView(
        child: Padding(
          padding: EdgeInsets.all(16.0),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: <Widget>[
              Image.asset(
                'assets/images/forgot_password.png',
                height: 200,
              ),
              SizedBox(height: 16.0),
              TextField(
                controller: emailController,
                decoration: InputDecoration(
                  labelText: 'Email',
                  prefixIcon: Icon(Icons.email),
                  errorText:
                      emailErrorMessage.isNotEmpty ? emailErrorMessage : null,
                ),
              ),
              SizedBox(height: 16.0),
              ElevatedButton(
                child: isLoading
                    ? CircularProgressIndicator()
                    : Text('Reset Password'),
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
                        final emailPattern =
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
                          Uri.parse('http://10.0.2.2:8000/forgetpassword'),
                          headers: {'Content-Type': 'application/json'},
                          body: jsonEncode(resetPasswordData),
                        );

                        // Check the response status
                        if (response.statusCode == 200) {
                          showDialog(
                            context: context,
                            builder: (BuildContext context) {
                              return AlertDialog(
                                title: Text('Verification Sent'),
                                content: Text(
                                    'A verification email has been sent to your email address.'),
                                actions: <Widget>[
                                  TextButton(
                                    child: Text('OK'),
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
              ),
              TextButton(
                child: Text('Back to Login'),
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
