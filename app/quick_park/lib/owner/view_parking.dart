import 'package:flutter/material.dart';
import 'dart:convert';
import '../services/api_service_owner.dart';

class ViewParkingPage extends StatefulWidget {
  const ViewParkingPage({super.key});

  @override
  _ViewParkingPageState createState() => _ViewParkingPageState();
}

class _ViewParkingPageState extends State<ViewParkingPage> {
  List<dynamic> parkingLocations = [];
  bool isLoading = true;

  @override
  void initState() {
    super.initState();
    fetchParkingLocations();
  }

  Future<void> fetchParkingLocations() async {
    try {
      final response = await ApiServiceOwner.viewParkingLocations();
      if (response.statusCode == 200) {
        setState(() {
          parkingLocations = jsonDecode(response.body);
          isLoading = false;
        });
      } else {
        throw Exception('Failed to load parking locations');
      }
    } catch (e) {
      setState(() {
        isLoading = false;
      });
      showDialog(
        context: context,
        builder: (BuildContext context) {
          return AlertDialog(
            title: const Text('Error'),
            content: Text(e.toString()),
            actions: [
              TextButton(
                child: const Text('OK'),
                onPressed: () {
                  Navigator.pop(context);
                },
              ),
            ],
          );
        },
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('View Parking'),
      ),
      body: isLoading
          ? const Center(child: CircularProgressIndicator())
          : ListView.builder(
              itemCount: parkingLocations.length,
              itemBuilder: (context, index) {
                final parking = parkingLocations[index];
                return ListTile(
                  title: Text(parking['address']),
                  subtitle: Text(
                      'Fee: ${parking['fee']} - Spots: ${parking['total_spot']}'),
                  trailing:
                      Text('Lat: ${parking['lat']}, Lon: ${parking['lon']}'),
                );
              },
            ),
    );
  }
}
