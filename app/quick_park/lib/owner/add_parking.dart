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

  final _formKey = GlobalKey<FormState>();

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
    if (mounted) {
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
  }

  void _onMapTap(LatLng location) {
    if (mounted) {
      setState(() {
        _selectedLocation = location;
      });
    }
  }

  String _formatCoordinate(double value) {
    return value.toStringAsFixed(6);
  }

  Future<void> _selectPdfDocument() async {
    FilePickerResult? result = await FilePicker.platform.pickFiles(
      type: FileType.custom,
      allowedExtensions: ['pdf'],
    );

    if (result != null && mounted) {
      setState(() {
        selectedPdfFile = File(result.files.single.path!);
      });
    }
  }

  void _removePdfDocument() {
    if (mounted) {
      setState(() {
        selectedPdfFile = null;
      });
    }
  }

  Future<void> _addParking() async {
    if (_selectedLocation == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please select a location on the map.')),
      );
      return;
    }

    if (selectedPdfFile == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please upload a PDF document.')),
      );
      return;
    }

    if (!_formKey.currentState!.validate()) {
      return;
    }

    if (mounted) {
      setState(() {
        isLoading = true;
      });
    }

    final parkingData = {
      'address': addressController.text,
      'fee': feeController.text,
      'total_spot': totalSpotController.text,
      'lat': _formatCoordinate(_selectedLocation!.latitude),
      'lon': _formatCoordinate(_selectedLocation!.longitude),
    };

    final response =
        await ApiServiceOwner.addParking(parkingData, selectedPdfFile!);

    if (response.statusCode == 200) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Parking added successfully')),
      );
      Navigator.pop(context);
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Failed to add parking')),
      );
    }

    if (mounted) {
      setState(() {
        isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Add Parking'),
      ),
      body: isLoading
          ? const Center(child: CircularProgressIndicator())
          : SingleChildScrollView(
              child: Padding(
                padding: const EdgeInsets.all(16.0),
                child: Form(
                  key: _formKey,
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
                                    markerId:
                                        const MarkerId('selected-location'),
                                    position: _selectedLocation!,
                                  )
                                }
                              : {},
                        ),
                      ),
                      const SizedBox(height: 16.0),
                      TextFormField(
                        controller: addressController,
                        decoration: const InputDecoration(
                          labelText: 'Address',
                          prefixIcon: Icon(Icons.location_city),
                        ),
                        validator: (value) {
                          if (value == null || value.isEmpty) {
                            return 'Please enter an address';
                          }
                          return null;
                        },
                      ),
                      const SizedBox(height: 16.0),
                      TextFormField(
                        controller: feeController,
                        decoration: const InputDecoration(
                          labelText: 'Fee',
                          prefixIcon: Icon(Icons.money),
                        ),
                        keyboardType: TextInputType.number,
                        validator: (value) {
                          if (value == null || value.isEmpty) {
                            return 'Please enter a fee';
                          }
                          return null;
                        },
                      ),
                      const SizedBox(height: 16.0),
                      TextFormField(
                        controller: totalSpotController,
                        decoration: const InputDecoration(
                          labelText: 'Total Spot',
                          prefixIcon: Icon(Icons.local_parking),
                        ),
                        keyboardType: TextInputType.number,
                        validator: (value) {
                          if (value == null || value.isEmpty) {
                            return 'Please enter the total spots';
                          }
                          if (int.tryParse(value) != null &&
                              int.parse(value) > 50) {
                            return 'Total spots cannot be more than 50';
                          }
                          return null;
                        },
                      ),
                      const SizedBox(height: 16.0),
                      ElevatedButton(
                        onPressed: _selectPdfDocument,
                        style: ElevatedButton.styleFrom(
                          backgroundColor: Colors.white,
                          textStyle: const TextStyle(color: Color(0xFF265073)),
                        ),
                        child: const Text(
                          'Upload PDF Document',
                          style: TextStyle(color: Color(0xFF265073)),
                        ),
                      ),
                      const SizedBox(height: 8.0),
                      selectedPdfFile != null
                          ? Column(
                              children: [
                                Text(
                                  'Selected File: ${selectedPdfFile!.path.split('/').last}',
                                ),
                                GestureDetector(
                                  onTap: _removePdfDocument,
                                  child: const Text(
                                    'Remove PDF Document',
                                    style: TextStyle(
                                      color: Colors.red,
                                      decoration: TextDecoration.underline,
                                    ),
                                  ),
                                ),
                              ],
                            )
                          : const Text('No file selected'),
                      const SizedBox(height: 16.0),
                      ElevatedButton(
                        onPressed: _addParking,
                        style: ElevatedButton.styleFrom(
                          backgroundColor: const Color(0xFF265073),
                          textStyle: const TextStyle(color: Colors.white),
                        ),
                        child: const Text('Add Parking',
                            style: TextStyle(color: Colors.white)),
                      ),
                    ],
                  ),
                ),
              ),
            ),
    );
  }
}
