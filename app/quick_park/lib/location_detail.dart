import 'package:flutter/material.dart';
import 'package:web_socket_channel/web_socket_channel.dart';
import 'dart:convert';
import 'services/api_service.dart';

class LocationDetail extends StatefulWidget {
  final String locationId;

  const LocationDetail({Key? key, required this.locationId}) : super(key: key);

  @override
  _LocationDetailState createState() => _LocationDetailState();
}

class _LocationDetailState extends State<LocationDetail> {
  WebSocketChannel? channel;
  Map<String, dynamic>? liveData;
  bool isLoading = true;
  String errorMessage = '';
  Map<String, dynamic>? locationDetails;

  @override
  void initState() {
    super.initState();
    _fetchLocationDetails();
    _initWebSocket();
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

  Future<void> _initWebSocket() async {
    try {
      // Fetch profile to get the vehicle ID
      final response = await ApiService.getProfile();
      final profileData = jsonDecode(response.body);
      String vehicleId = profileData['vehicleId'] ?? '';

      // Construct the WebSocket URL
      String url = 'ws://10.0.2.2:2564/parking/${widget.locationId}/$vehicleId';

      // Establish WebSocket connection
      channel = WebSocketChannel.connect(Uri.parse(url));

      // Listen to the WebSocket stream
      channel!.stream.listen(
        (message) {
          setState(() {
            Map<String, dynamic> data = jsonDecode(message);
            if (data.containsKey('message')) {
              ScaffoldMessenger.of(context).showSnackBar(SnackBar(
                content: Text(data['message']),
              ));
            }
            if (data.containsKey('value')) {
              liveData = data;
            } else if (liveData != null) {
              liveData!.addAll(data);
            }
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
            errorMessage = 'WebSocket closed';
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
      _sendWebSocketAction(action);
    }
  }

  void _sendWebSocketAction(String action) {
    if (channel != null) {
      channel!.sink.add(jsonEncode({"action": action}));
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
                            Text(
                                'Address: ${locationDetails!['address'] ?? 'N/A'}',
                                style: TextStyle(fontSize: 18)),
                            SizedBox(height: 8),
                            Text(
                                'Total Spots: ${liveData?['total_spot'] ?? 'N/A'}',
                                style: TextStyle(fontSize: 18)),
                            SizedBox(height: 8),
                            Text(
                                'Used Spots: ${liveData?['used_spot'] ?? 'N/A'}',
                                style: TextStyle(fontSize: 18)),
                            SizedBox(height: 8),
                            Text('Fee: ${locationDetails!['fee'] ?? 'N/A'}',
                                style: TextStyle(fontSize: 18)),
                            SizedBox(height: 24),
                            Center(
                              child: liveData == null
                                  ? CircularProgressIndicator()
                                  : ElevatedButton(
                                      onPressed: () {
                                        if (liveData?['value'] == 'Reserve') {
                                          _confirmAction(
                                              'reserve', 'reserve parking');
                                        } else if (liveData?['value'] ==
                                            'Reserved') {
                                          _confirmAction(
                                              'release', 'release parking');
                                        }
                                      },
                                      child:
                                          Text(liveData?['value'] == 'Reserve'
                                              ? 'Reserve Parking'
                                              : liveData?['value'] == 'Reserved'
                                                  ? 'Release Parking'
                                                  : 'Loading...'),
                                    ),
                            ),
                          ],
                        ),
                      ),
      ),
    );
  }
}
