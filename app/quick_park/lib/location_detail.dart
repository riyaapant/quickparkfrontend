import 'package:flutter/material.dart';
import 'package:web_socket_channel/web_socket_channel.dart';
import 'package:url_launcher/url_launcher_string.dart';
import 'dart:convert';
import 'services/api_service.dart';
import 'profile.dart';

class LocationDetail extends StatefulWidget {
  final String locationId;

  const LocationDetail({Key? key, required this.locationId}) : super(key: key);

  @override
  _LocationDetailState createState() => _LocationDetailState();
}

class _LocationDetailState extends State<LocationDetail> {
  WebSocketChannel? channel;
  Map<String, dynamic> liveData = {};
  bool isLoading = true;
  String errorMessage = '';
  Map<String, dynamic>? locationDetails;

  @override
  void initState() {
    super.initState();
    _fetchLocationDetails();
    _checkUserVerificationAndProceed();
  }

  Future<void> _fetchLocationDetails() async {
    try {
      final details =
          await ApiService.getParkingLocationDetails(widget.locationId);
      setState(() {
        locationDetails = details;
        isLoading = false;
      });
    } catch (e) {
      setState(() {
        errorMessage = 'Failed to fetch location details: $e';
        isLoading = false;
      });
    }
  }

  Future<void> _checkUserVerificationAndProceed() async {
    try {
      final response = await ApiService.getProfile();
      final profileData = jsonDecode(response.body);
      bool isVerified = profileData['is_paperverified'] ?? false;

      if (isVerified) {
        _checkVehicleIdAndInitWebSocket(profileData);
      } else {
        _showVerificationRequiredDialog();
      }
    } catch (e) {
      setState(() {
        errorMessage = 'Failed to fetch profile: $e';
        isLoading = false;
      });
    }
  }

  Future<void> _checkVehicleIdAndInitWebSocket(
      Map<String, dynamic> profileData) async {
    String? vehicleId = profileData['vehicleId'];

    if (vehicleId == null || vehicleId.isEmpty) {
      _showUpdateVehicleIdDialog();
    } else {
      _initWebSocket(vehicleId);
    }
  }

  void _showVerificationRequiredDialog() {
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (BuildContext context) {
        return AlertDialog(
          title: Text('Verification Required'),
          content: Text(
              'Your account needs to be verified before you can use this feature. Please complete the verification process or wait for verification if you have already completed the process.'),
          actions: <Widget>[
            TextButton(
              child: Text('Close'),
              onPressed: () {
                Navigator.of(context).pop();
                Navigator.of(context).pop(); // Return to previous screen
              },
            ),
          ],
        );
      },
    );
  }

  void _showUpdateVehicleIdDialog() {
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (BuildContext context) {
        return AlertDialog(
          title: Text('Vehicle ID Missing'),
          content: Text(
              'Please update your vehicle ID in your profile to use this feature.'),
          actions: <Widget>[
            TextButton(
              child: Text('Close'),
              onPressed: () {
                Navigator.of(context).pop();
                Navigator.of(context).pushReplacement(
                  MaterialPageRoute(builder: (context) => ProfilePage()),
                );
              },
            ),
          ],
        );
      },
    ).then((_) {
      Navigator.of(context).pop();
    });
  }

  Future<void> _initWebSocket(String vehicleId) async {
    try {
      String url = 'ws://10.0.2.2:2564/parking/${widget.locationId}/$vehicleId';
      channel = WebSocketChannel.connect(Uri.parse(url));

      channel!.stream.listen(
        (message) {
          setState(() {
            Map<String, dynamic> data = jsonDecode(message);
            _updateLiveData(data);
          });
        },
        onError: (error) {
          setState(() {
            errorMessage = 'WebSocket error: $error';
            isLoading = false;
          });
        },
        onDone: () {
          setState(() {
            if (channel != null) {
              channel!.sink.close();
            }
            isLoading = false;
          });
        },
      );
    } catch (e) {
      setState(() {
        errorMessage = 'Failed to initialize WebSocket: $e';
        isLoading = false;
      });
    }
  }

  void _updateLiveData(Map<String, dynamic> data) {
    if (data.containsKey('message')) {
      _showMessageDialog(data['message']);
    }

    data.forEach((key, value) {
      if (key != 'message') {
        liveData[key] = value;
      }
    });
  }

  @override
  void dispose() {
    channel?.sink.close();
    super.dispose();
  }

  Future<void> _confirmAction(String action, String actionText) async {
    final confirmed = await showDialog<bool>(
      context: context,
      builder: (context) {
        return AlertDialog(
          title: Text('Confirm $actionText'),
          content: Text('Are you sure you want to $actionText?'),
          actions: [
            TextButton(
              onPressed: () => Navigator.of(context).pop(false),
              child: Text('Cancel'),
            ),
            TextButton(
              onPressed: () => Navigator.of(context).pop(true),
              child: Text('Confirm'),
            ),
          ],
        );
      },
    );

    if (confirmed == true) {
      if (action == 'release') {
        _askCancellationReason();
      } else {
        _sendWebSocketAction(action);
      }
    }
  }

  Future<void> _askCancellationReason() async {
    final reasonController = TextEditingController();
    bool isReasonEmpty = false;

    final reason = await showDialog<String>(
      context: context,
      builder: (context) {
        return StatefulBuilder(
          builder: (context, setState) {
            return AlertDialog(
              title: Text('Cancellation Reason'),
              content: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  TextField(
                    controller: reasonController,
                    decoration: InputDecoration(
                      hintText: 'Enter the reason for cancellation',
                      errorText:
                          isReasonEmpty ? 'Reason cannot be empty' : null,
                    ),
                  ),
                ],
              ),
              actions: [
                TextButton(
                  onPressed: () => Navigator.of(context).pop(null),
                  child: Text('Cancel'),
                ),
                TextButton(
                  onPressed: () {
                    if (reasonController.text.isEmpty) {
                      setState(() {
                        isReasonEmpty = true;
                      });
                    } else {
                      Navigator.of(context).pop(reasonController.text);
                    }
                  },
                  child: Text('Submit'),
                ),
              ],
            );
          },
        );
      },
    );

    if (reason != null && reason.isNotEmpty) {
      _sendWebSocketAction('release', reason: reason);
    }
  }

  void _sendWebSocketAction(String action, {String? reason}) {
    if (channel != null) {
      Map<String, dynamic> payload = {"action": action};
      if (reason != null) {
        payload["reason"] = reason;
      }
      channel!.sink.add(jsonEncode(payload));
    }
  }

  void _showMessageDialog(String message) {
    showDialog(
      context: context,
      builder: (context) {
        return AlertDialog(
          title: Text('Message'),
          content: Text(message),
          actions: [
            TextButton(
              onPressed: () {
                Navigator.of(context).pop();
                if (channel != null) {
                  channel!.sink.close();
                }
                Navigator.of(context).pop();
              },
              child: Text('OK'),
            ),
          ],
        );
      },
    );
  }

  void _navigateToParking() async {
    if (locationDetails != null &&
        locationDetails!['lat'] != null &&
        locationDetails!['lon'] != null) {
      final double lat = locationDetails!['lat'];
      final double lon = locationDetails!['lon'];
      final String googleMapsUrl =
          'https://www.google.com/maps/dir/?api=1&destination=$lat,$lon&travelmode=driving';

      if (await canLaunchUrlString(googleMapsUrl)) {
        await launchUrlString(googleMapsUrl);
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Could not open Google Maps')),
        );
      }
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Navigation data not available')),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return WillPopScope(
      onWillPop: () async {
        channel?.sink.close();
        return true;
      },
      child: Scaffold(
        appBar: AppBar(
          title: Text('Parking Location Details'),
        ),
        body: isLoading
            ? Center(child: CircularProgressIndicator())
            : errorMessage.isNotEmpty
                ? Center(child: Text(errorMessage))
                : locationDetails == null
                    ? Center(child: Text('No details available'))
                    : Padding(
                        padding: const EdgeInsets.all(16.0),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Card(
                              elevation: 4,
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(10),
                              ),
                              child: Container(
                                width: double.infinity,
                                padding: const EdgeInsets.all(16.0),
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Text(
                                      'Address:',
                                      style: TextStyle(
                                          fontSize: 18,
                                          fontWeight: FontWeight.bold),
                                    ),
                                    SizedBox(height: 4),
                                    Text(
                                      '${locationDetails!['address'] ?? 'N/A'}',
                                      style: TextStyle(fontSize: 16),
                                    ),
                                    SizedBox(height: 16),
                                    Text(
                                      'Total Spots:',
                                      style: TextStyle(
                                          fontSize: 18,
                                          fontWeight: FontWeight.bold),
                                    ),
                                    SizedBox(height: 4),
                                    Text(
                                      '${liveData['total_spot'] ?? 'N/A'}',
                                      style: TextStyle(fontSize: 16),
                                    ),
                                    SizedBox(height: 16),
                                    Text(
                                      'Used Spots:',
                                      style: TextStyle(
                                          fontSize: 18,
                                          fontWeight: FontWeight.bold),
                                    ),
                                    SizedBox(height: 4),
                                    Text(
                                      '${liveData['used_spot'] ?? 'N/A'}',
                                      style: TextStyle(fontSize: 16),
                                    ),
                                    SizedBox(height: 16),
                                    Text(
                                      'Fee:',
                                      style: TextStyle(
                                          fontSize: 18,
                                          fontWeight: FontWeight.bold),
                                    ),
                                    SizedBox(height: 4),
                                    Text(
                                      '${locationDetails!['fee'] ?? 'N/A'}',
                                      style: TextStyle(fontSize: 16),
                                    ),
                                  ],
                                ),
                              ),
                            ),
                            SizedBox(height: 24),
                            Center(
                              child: liveData.isEmpty
                                  ? CircularProgressIndicator()
                                  : Column(
                                      children: [
                                        ElevatedButton(
                                          onPressed:
                                              liveData['value'] == 'Parked'
                                                  ? null
                                                  : () {
                                                      if (liveData['value'] ==
                                                          'Reserve') {
                                                        _confirmAction(
                                                            'reserve',
                                                            'reserve parking');
                                                      } else if (liveData[
                                                              'value'] ==
                                                          'Reserved') {
                                                        _confirmAction(
                                                            'release',
                                                            'cancel reservation');
                                                      }
                                                    },
                                          style: ElevatedButton.styleFrom(
                                            backgroundColor:
                                                liveData['value'] == 'Parked'
                                                    ? Colors.yellow
                                                    : liveData['value'] ==
                                                            'Reserved'
                                                        ? Colors.red
                                                        : const Color(
                                                            0xFF265073),
                                            foregroundColor:
                                                liveData['value'] == 'Parked'
                                                    ? Colors.white
                                                    : Colors.white,
                                            disabledBackgroundColor:
                                                Color.fromARGB(
                                                    255, 179, 162, 8),
                                            disabledForegroundColor:
                                                Colors.white,
                                          ),
                                          child: liveData['value'] == 'Reserve'
                                              ? Text('Reserve Parking')
                                              : liveData['value'] == 'Reserved'
                                                  ? Text('Cancel Reservation')
                                                  : liveData['value'] ==
                                                          'Parked'
                                                      ? Text('Parked')
                                                      : Text('Loading...'),
                                        ),
                                        if (liveData['value'] == 'Reserved')
                                          SizedBox(height: 16),
                                        if (liveData['value'] == 'Reserved')
                                          ElevatedButton(
                                            onPressed: _navigateToParking,
                                            style: ElevatedButton.styleFrom(
                                              backgroundColor: Colors.green,
                                              foregroundColor: Colors.white,
                                            ),
                                            child: Text('Navigate'),
                                          ),
                                      ],
                                    ),
                            ),
                          ],
                        ),
                      ),
      ),
    );
  }
}
