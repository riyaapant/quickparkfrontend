import 'package:flutter/material.dart';
import '../services/api_service_owner.dart';
import 'dart:convert';

class ParkingCard extends StatefulWidget {
  const ParkingCard({Key? key}) : super(key: key);

  @override
  _ParkingCardState createState() => _ParkingCardState();
}

class _ParkingCardState extends State<ParkingCard> {
  List<dynamic> parkingLocations = [];
  bool isLoading = true;
  String errorMessage = '';

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
        errorMessage = 'Error: $e';
        isLoading = false;
      });
    }
  }

  Future<Map<String, dynamic>> fetchParkingDetails(int parkingId) async {
    try {
      final response = await ApiServiceOwner.viewParkingDetails(parkingId);
      if (response.statusCode == 200) {
        return jsonDecode(response.body);
      } else {
        throw Exception('Failed to load parking details');
      }
    } catch (e) {
      throw Exception('Error: $e');
    }
  }

  @override
  Widget build(BuildContext context) {
    if (isLoading) {
      return const Center(child: CircularProgressIndicator());
    }
    if (errorMessage.isNotEmpty) {
      return Center(child: Text(errorMessage));
    }

    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(16),
      child: Card(
        elevation: 4,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            mainAxisSize: MainAxisSize.min, // Fit to content
            children: [
              const Text(
                'Parking Locations',
                style: TextStyle(
                  fontSize: 20,
                  fontWeight: FontWeight.bold,
                  color: Color(0xFF265073),
                ),
              ),
              const SizedBox(height: 16),
              if (parkingLocations.isEmpty)
                const Padding(
                  padding: EdgeInsets.symmetric(vertical: 16.0),
                  child: Text(
                    'No parking locations available',
                    style: TextStyle(fontSize: 16, fontStyle: FontStyle.italic),
                  ),
                )
              else
                SizedBox(
                  height: 200, // Adjust height as needed
                  child: PageView.builder(
                    itemCount: parkingLocations.length,
                    itemBuilder: (context, index) {
                      final parking = parkingLocations[index];
                      return FutureBuilder<Map<String, dynamic>>(
                        future: fetchParkingDetails(parking['id']),
                        builder: (context, snapshot) {
                          if (snapshot.connectionState ==
                              ConnectionState.waiting) {
                            return const Center(
                                child: CircularProgressIndicator());
                          } else if (snapshot.hasError) {
                            return Center(
                                child: Text('Error: ${snapshot.error}'));
                          } else if (!snapshot.hasData) {
                            return const Center(
                                child: Text('No data available'));
                          }

                          final parkingDetails = snapshot.data!;
                          return Card(
                            margin: const EdgeInsets.symmetric(
                                horizontal: 8.0, vertical: 4.0),
                            elevation: 4,
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(10),
                            ),
                            child: Padding(
                              padding: const EdgeInsets.all(16.0),
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                mainAxisSize:
                                    MainAxisSize.min, // Fit to content
                                children: [
                                  Text(
                                    parking['address'] ?? 'No address',
                                    style: const TextStyle(
                                      fontSize: 16,
                                      fontWeight: FontWeight.bold,
                                    ),
                                  ),
                                  const SizedBox(height: 8),
                                  Text(
                                      'Total Spots: ${parkingDetails['total'] ?? 'N/A'}'),
                                  Text(
                                      'Used Spots: ${parkingDetails['used'] ?? 'N/A'}'),
                                  Text(
                                      'Fee: Rs ${parkingDetails['fee'] ?? 'N/A'}'),
                                ],
                              ),
                            ),
                          );
                        },
                      );
                    },
                  ),
                ),
              const SizedBox(height: 8), // A little bit of gap at the bottom
            ],
          ),
        ),
      ),
    );
  }
}
