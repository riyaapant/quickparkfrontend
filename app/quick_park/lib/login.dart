import 'package:flutter/material.dart';
import 'dart:convert';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

import 'signup.dart';
import 'dashboard.dart';
import './owner/owner_dashboard.dart';
import 'forgot_password.dart';
import 'document.dart';
import 'services/api_service.dart';

class LoginPage extends StatefulWidget {
  const LoginPage({super.key});

  @override
  State<LoginPage> createState() => _LoginPageState();
}

class _LoginPageState extends State<LoginPage> {
  final TextEditingController emailController = TextEditingController();
  final TextEditingController passwordController = TextEditingController();
  String emailErrorMessage = '';
  String passwordErrorMessage = '';
  bool isLoading = false;

  final storage = const FlutterSecureStorage();

  void _login() async {
    // Reset existing error messages
    setState(() {
      emailErrorMessage = '';
      passwordErrorMessage = '';
      isLoading = true;
    });

    // Validate email
    if (emailController.text.isEmpty) {
      setState(() {
        emailErrorMessage = 'Email is required';
        isLoading = false;
      });
      return;
    }

    const emailPattern = r'^[\w-]+(\.[\w-]+)*@([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,7}$';
    final emailRegExp = RegExp(emailPattern);
    if (!emailRegExp.hasMatch(emailController.text)) {
      setState(() {
        emailErrorMessage = 'Invalid email format';
        isLoading = false;
      });
      return;
    }

    // Validate password
    if (passwordController.text.isEmpty) {
      setState(() {
        passwordErrorMessage = 'Password is required';
        isLoading = false;
      });
      return;
    }

    if (passwordController.text.length < 6) {
      setState(() {
        passwordErrorMessage = 'Password must be at least 6 characters long';
        isLoading = false;
      });
      return;
    }

    // Prepare the login data
    var loginData = {
      'email': emailController.text,
      'password': passwordController.text,
    };

    // Send a POST request using ApiService
    var response = await ApiService.post('/login', loginData);

    // Check the response status
    if (response.statusCode == 200) {
      // Login successful
      var tokenData = jsonDecode(response.body);

      // Extract the access and refresh tokens from the response
      var accessToken = tokenData['access'];
      var refreshToken = tokenData['refresh'];
      var document = tokenData['document']; // Extract document parameter
      var isOwner = tokenData['is_owner']; // Extract is_owner parameter

      // Store the tokens locally
      await storage.write(key: 'access_token', value: accessToken);
      await storage.write(key: 'refresh_token', value: refreshToken);

      // Navigate based on the is_owner parameter
      if (mounted) {
        if (isOwner) {
          Navigator.pushReplacement(
            context,
            MaterialPageRoute(
              builder: (context) => const OwnerDashboardPage(),
            ),
          );
        } else if (document == null) {
          Navigator.pushReplacement(
            context,
            MaterialPageRoute(
              builder: (context) => const DocumentPage(),
            ),
          );
        } else {
          Navigator.pushReplacement(
            context,
            MaterialPageRoute(
              builder: (context) => const DashboardPage(),
            ),
          );
        }
      }
    } else {
      setState(() {
        emailErrorMessage = 'Invalid email or password';
        passwordErrorMessage = 'Invalid email or password';
        isLoading = false;
      });
    }
  }

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
                'assets/images/login_image.png',
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
              isLoading
                  ? const CircularProgressIndicator()
                  : ElevatedButton(
                      onPressed: _login,
                      child: const Text('Login'),
                    ),
              const SizedBox(height: 16.0),
              TextButton(
                onPressed: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (context) => const ForgotPasswordPage(),
                    ),
                  );
                },
                child: const Text('Forgot Password?'),
              ),
              TextButton(
                onPressed: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (context) => const SignupPage(),
                    ),
                  );
                },
                child: const Text('Don\'t have an account? Sign up'),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
