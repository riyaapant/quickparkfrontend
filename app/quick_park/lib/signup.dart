import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

class SignupPage extends StatefulWidget {
  @override
  _SignupPageState createState() => _SignupPageState();
}

class _SignupPageState extends State<SignupPage> {
  final TextEditingController firstNameController = TextEditingController();
  final TextEditingController lastNameController = TextEditingController();
  final TextEditingController addressController = TextEditingController();
  final TextEditingController contactNumberController = TextEditingController();
  final TextEditingController vehicleNumberController = TextEditingController();
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
        title: Text('QuickPark - Sign Up'),
      ),
      body: SingleChildScrollView(
        child: Padding(
          padding: EdgeInsets.all(16.0),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: <Widget>[
              SizedBox(height: 16.0),
              TextField(
                controller: firstNameController,
                decoration: InputDecoration(
                  labelText: 'First Name',
                  prefixIcon: Icon(Icons.person),
                  errorText: firstNameErrorMessage.isNotEmpty
                      ? firstNameErrorMessage
                      : null,
                ),
              ),
              SizedBox(height: 16.0),
              TextField(
                controller: lastNameController,
                decoration: InputDecoration(
                  labelText: 'Last Name',
                  prefixIcon: Icon(Icons.person),
                  errorText: lastNameErrorMessage.isNotEmpty
                      ? lastNameErrorMessage
                      : null,
                ),
              ),
              SizedBox(height: 16.0),
              TextField(
                controller: addressController,
                decoration: InputDecoration(
                  labelText: 'Address',
                  prefixIcon: Icon(Icons.location_city),
                  errorText: addressErrorMessage.isNotEmpty
                      ? addressErrorMessage
                      : null,
                ),
              ),
              SizedBox(height: 16.0),
              TextField(
                controller: contactNumberController,
                decoration: InputDecoration(
                  labelText: 'Contact Number',
                  prefixIcon: Icon(Icons.phone),
                  errorText: contactNumberErrorMessage.isNotEmpty
                      ? contactNumberErrorMessage
                      : null,
                ),
                keyboardType: TextInputType.phone,
              ),
              SizedBox(height: 16.0),
              TextField(
                controller: vehicleNumberController,
                decoration: InputDecoration(
                  labelText: 'Vehicle Number',
                  prefixIcon: Icon(Icons.directions_car_filled),
                  errorText: vehicleNumberErrorMessage.isNotEmpty
                      ? vehicleNumberErrorMessage
                      : null,
                ),
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
              TextField(
                controller: passwordController,
                decoration: InputDecoration(
                  labelText: 'Password',
                  prefixIcon: Icon(Icons.lock),
                  errorText: passwordErrorMessage.isNotEmpty
                      ? passwordErrorMessage
                      : null,
                ),
                obscureText: true,
              ),
              SizedBox(height: 16.0),
              ElevatedButton(
                child:
                    isLoading ? CircularProgressIndicator() : Text('Sign Up'),
                onPressed: isLoading
                    ? null
                    : () async {
                        // Reset existing error messages
                        setState(() {
                          firstNameErrorMessage = '';
                          lastNameErrorMessage = '';
                          addressErrorMessage = '';
                          contactNumberErrorMessage = '';
                          vehicleNumberErrorMessage = '';
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
                        final contactNumberPattern =
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

                        if (vehicleNumberController.text.isEmpty) {
                          setState(() {
                            vehicleNumberErrorMessage =
                                'Vehicle Number is required';
                            isLoading = false;
                          });
                          return;
                        }
                        //Vehicle number validation
                        final vehicleNumberPattern = r'^B [A-Z]{2}\d{4}$';
                        final vehicleNumberRegExp =
                            RegExp(vehicleNumberPattern);
                        if (!vehicleNumberRegExp
                            .hasMatch(vehicleNumberController.text)) {
                          setState(() {
                            vehicleNumberErrorMessage =
                                'Invalid vehicle number format';
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
                          'vehicle_id': vehicleNumberController.text,
                          'password': passwordController.text,
                        };

                        // Send a POST request
                        var response = await http.post(
                          Uri.parse('http://10.0.2.2:8000/user/signup'),
                          headers: {'Content-Type': 'application/json'},
                          body: jsonEncode(signupData),
                        );

                        // Check the response status
                        if (response.statusCode == 200) {
                          // Signup successful
                          // You can perform any necessary actions here, such as displaying a success message
                          showDialog(
                            context: context,
                            builder: (BuildContext context) {
                              return AlertDialog(
                                title: Text('Verification Link Sent'),
                                content: Text(
                                    'A verification link has been sent to your email.'),
                                actions: [
                                  TextButton(
                                    child: Text('OK'),
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
                          // You can handle the failure scenario according to your requirements
                          showDialog(
                            context: context,
                            builder: (BuildContext context) {
                              return AlertDialog(
                                title: Text('Sign Up Failed'),
                                content: Text(
                                    'There was an error during sign up. Please try again.'),
                                actions: [
                                  TextButton(
                                    child: Text('OK'),
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
              ),
              TextButton(
                child: Text('Already have an account? Sign In'),
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
