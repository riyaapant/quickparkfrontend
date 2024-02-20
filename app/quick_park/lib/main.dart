import 'package:flutter/material.dart';
import 'login.dart';

void main() => runApp(QuickPark());

class QuickPark extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'QuickPark',
      theme: ThemeData(
        primarySwatch: Colors.blue,
      ),
      home: LoginPage(),
    );
  }
}
