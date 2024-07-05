import 'package:flutter/material.dart';
import 'dart:convert';
import 'package:url_launcher/url_launcher.dart';
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

  Future<void> _launchURL(String url) async {
    final Uri uri = Uri.parse(url);
    if (!await launchUrl(uri)) {
      throw 'Could not launch $url';
    }
  }

  Future<void> _viewParkingDetails(int parkingId) async {
    try {
      final response = await ApiServiceOwner.viewParkingDetails(parkingId);
      if (response.statusCode == 200) {
        final parkingDetails = jsonDecode(response.body);
        showDialog(
          context: context,
          builder: (BuildContext context) {
            return AlertDialog(
              title: const Text('Parking Details'),
              content: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisSize: MainAxisSize.min,
                children: [
                  Text(
                    'Address:',
                    style: TextStyle(fontWeight: FontWeight.bold),
                  ),
                  Text(parkingDetails['address']),
                  SizedBox(height: 8),
                  Text(
                    'Total Spots:',
                    style: TextStyle(fontWeight: FontWeight.bold),
                  ),
                  Text(parkingDetails['total'].toString()),
                  SizedBox(height: 8),
                  Text(
                    'Used Spots:',
                    style: TextStyle(fontWeight: FontWeight.bold),
                  ),
                  Text(parkingDetails['used'].toString()),
                  SizedBox(height: 8),
                  Text(
                    'Fee:',
                    style: TextStyle(fontWeight: FontWeight.bold),
                  ),
                  Text(parkingDetails['fee'].toString()),
                ],
              ),
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
      } else {
        throw Exception('Failed to load parking details');
      }
    } catch (e) {
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
                final bool isPaperVerified =
                    parking['is_paperverified'] ?? false;
                final String? documentLink = parking['document'];
                final int parkingId = parking['id'];

                return Card(
                  margin: const EdgeInsets.symmetric(
                    vertical: 8.0,
                    horizontal: 16.0,
                  ),
                  child: Padding(
                    padding: const EdgeInsets.all(8.0),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Expanded(
                              child: Text(
                                parking['address'],
                                style: TextStyle(
                                  fontSize: 16,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                            ),
                            ElevatedButton(
                              onPressed: () {},
                              style: ElevatedButton.styleFrom(
                                backgroundColor:
                                    isPaperVerified ? Colors.green : Colors.red,
                                minimumSize: const Size(100, 36),
                              ),
                              child: Text(
                                isPaperVerified ? 'Verified' : 'Unverified',
                                style: const TextStyle(color: Colors.white),
                              ),
                            ),
                          ],
                        ),
                        if (documentLink != null)
                          Padding(
                            padding: const EdgeInsets.only(top: 8.0),
                            child: Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                ElevatedButton(
                                  onPressed: () => _launchURL(documentLink),
                                  child: const Text('View Document'),
                                ),
                                ElevatedButton(
                                  onPressed: () =>
                                      _viewParkingDetails(parkingId),
                                  child: const Text('View Details'),
                                ),
                              ],
                            ),
                          ),
                      ],
                    ),
                  ),
                );
              },
            ),
    );
  }
}
