import 'package:flutter/material.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';
import 'package:location/location.dart';
import 'package:file_picker/file_picker.dart';
import 'dart:io';
import '../services/api_service_owner.dart';

class AddParkingPage extends StatefulWidget {
  const AddParkingPage({super.key});

  @override
  _AddParkingPageState createState() => _AddParkingPageState();
}

class _AddParkingPageState extends State<AddParkingPage> {
  final TextEditingController addressController = TextEditingController();
  final TextEditingController feeController =
      TextEditingController(text: '50.00');
  final TextEditingController totalSpotController = TextEditingController();

  LocationData? _currentLocation;
  late GoogleMapController _mapController;
  final Location _locationService = Location();
  LatLng? _selectedLocation;
  bool isLoading = false;
  File? selectedPdfFile;

  @override
  void initState() {
    super.initState();
    _checkLocationPermission();
  }

  void _checkLocationPermission() async {
    bool _serviceEnabled;
    PermissionStatus _permissionGranted;

    _serviceEnabled = await _locationService.serviceEnabled();
    if (!_serviceEnabled) {
      _serviceEnabled = await _locationService.requestService();
      if (!_serviceEnabled) {
        return;
      }
    }

    _permissionGranted = await _locationService.hasPermission();
    if (_permissionGranted == PermissionStatus.denied) {
      _permissionGranted = await _locationService.requestPermission();
      if (_permissionGranted != PermissionStatus.granted) {
        return;
      } else {
        _getUserLocation();
      }
    } else {
      _getUserLocation();
    }
  }

  void _getUserLocation() async {
    _currentLocation = await _locationService.getLocation();
    setState(() {
      if (_currentLocation != null) {
        _mapController.animateCamera(
          CameraUpdate.newCameraPosition(
            CameraPosition(
              target: LatLng(
                  _currentLocation!.latitude!, _currentLocation!.longitude!),
              zoom: 15,
            ),
          ),
        );
      }
    });
  }

  void _onMapTap(LatLng location) {
    setState(() {
      _selectedLocation = location;
    });
  }

  String _formatCoordinate(double value) {
    return value.toStringAsFixed(6);
  }

  Future<void> _selectPdfDocument() async {
    FilePickerResult? result = await FilePicker.platform.pickFiles(
      type: FileType.custom,
      allowedExtensions: ['pdf'],
    );

    if (result != null) {
      setState(() {
        selectedPdfFile = File(result.files.single.path!);
      });
    }
  }

  Future<void> _addParking() async {
    if (_selectedLocation == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Please select a location on the map.')),
      );
      return;
    }

    if (selectedPdfFile == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Please upload a PDF document.')),
      );
      return;
    }

    setState(() {
      isLoading = true;
    });

    final parkingData = {
      'address': addressController.text,
      'fee': feeController.text.isNotEmpty ? feeController.text : '50.00',
      'total_spot': totalSpotController.text,
      'lat': _formatCoordinate(_selectedLocation!.latitude),
      'lon': _formatCoordinate(_selectedLocation!.longitude),
    };

    final response =
        await ApiServiceOwner.addParking(parkingData, selectedPdfFile!);

    if (response.statusCode == 200) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Parking added successfully')),
      );
      Navigator.pop(context);
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Failed to add parking')),
      );
    }

    setState(() {
      isLoading = false;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Add Parking'),
      ),
      body: isLoading
          ? Center(child: CircularProgressIndicator())
          : SingleChildScrollView(
              child: Padding(
                padding: const EdgeInsets.all(16.0),
                child: Column(
                  children: <Widget>[
                    Container(
                      height: 300,
                      child: GoogleMap(
                        initialCameraPosition: const CameraPosition(
                          target: LatLng(27.707087, 85.322759),
                          zoom: 11,
                        ),
                        myLocationEnabled: true,
                        myLocationButtonEnabled: true,
                        onMapCreated: (GoogleMapController controller) {
                          _mapController = controller;
                          if (_currentLocation != null) {
                            _mapController.animateCamera(
                              CameraUpdate.newCameraPosition(
                                CameraPosition(
                                  target: LatLng(_currentLocation!.latitude!,
                                      _currentLocation!.longitude!),
                                  zoom: 15,
                                ),
                              ),
                            );
                          }
                        },
                        onTap: _onMapTap,
                        markers: _selectedLocation != null
                            ? {
                                Marker(
                                  markerId: MarkerId('selected-location'),
                                  position: _selectedLocation!,
                                )
                              }
                            : {},
                      ),
                    ),
                    const SizedBox(height: 16.0),
                    TextField(
                      controller: addressController,
                      decoration: InputDecoration(
                        labelText: 'Address',
                        prefixIcon: const Icon(Icons.location_city),
                      ),
                    ),
                    const SizedBox(height: 16.0),
                    TextField(
                      controller: feeController,
                      decoration: InputDecoration(
                        labelText: 'Fee',
                        prefixIcon: const Icon(Icons.attach_money),
                      ),
                      keyboardType: TextInputType.number,
                    ),
                    const SizedBox(height: 16.0),
                    TextField(
                      controller: totalSpotController,
                      decoration: InputDecoration(
                        labelText: 'Total Spot',
                        prefixIcon: const Icon(Icons.local_parking),
                      ),
                      keyboardType: TextInputType.number,
                    ),
                    const SizedBox(height: 16.0),
                    ElevatedButton(
                      onPressed: _selectPdfDocument,
                      child: Text('Upload PDF Document'),
                    ),
                    const SizedBox(height: 8.0),
                    selectedPdfFile != null
                        ? Text(
                            'Selected File: ${selectedPdfFile!.path.split('/').last}')
                        : Text('No file selected'),
                    const SizedBox(height: 16.0),
                    ElevatedButton(
                      onPressed: _addParking,
                      child: const Text('Add Parking'),
                    ),
                  ],
                ),
              ),
            ),
    );
  }
}
