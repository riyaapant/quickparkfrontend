import 'package:flutter/material.dart';
import 'package:sliding_up_panel/sliding_up_panel.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';
import 'package:location/location.dart';
import 'services/api_service.dart';
import 'location_detail.dart';

class SlideUpPanel extends StatefulWidget {
  const SlideUpPanel({super.key});

  @override
  State<SlideUpPanel> createState() => _SlideUpPanelState();
}

class _SlideUpPanelState extends State<SlideUpPanel> {
  late List<String> locations;
  late List<String> filteredLocations;
  late Map<String, LatLng> locationCoordinates;
  late Map<String, String> locationIds;
  LocationData? _currentLocation;
  late GoogleMapController _mapController;
  final Location _locationService = Location();
  final PanelController _panelController = PanelController();
  Marker? _selectedMarker;

  @override
  void initState() {
    super.initState();
    locations = [];
    filteredLocations = locations;
    locationCoordinates = {};
    locationIds = {};
    _checkLocationPermission();
    _fetchParkingLocations();
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
      _mapController.animateCamera(
        CameraUpdate.newCameraPosition(
          CameraPosition(
            target: LatLng(
                _currentLocation!.latitude!, _currentLocation!.longitude!),
            zoom: 15,
          ),
        ),
      );
    });
  }

  void searchLocations(String query) {
    setState(() {
      filteredLocations = locations
          .where((location) =>
              location.toLowerCase().contains(query.toLowerCase()))
          .toList();
    });
  }

  void _onLocationSelected(String location) async {
    LatLng coordinates = locationCoordinates[location]!;
    String locationId = locationIds[location]!;

    setState(() {
      _selectedMarker = Marker(
        markerId: MarkerId(location),
        position: coordinates,
        infoWindow: InfoWindow(title: location),
        icon: BitmapDescriptor.defaultMarkerWithHue(BitmapDescriptor.hueAzure),
        onTap: () async {
          await _fetchParkingLocationDetails(locationId);
        },
      );
    });
    _mapController.animateCamera(
      CameraUpdate.newCameraPosition(
        CameraPosition(
          target: coordinates,
          zoom: 15,
        ),
      ),
    );
    _panelController.close();
    _mapController
        .showMarkerInfoWindow(MarkerId(location)); // Show the info window

    // Navigate directly to the LocationDetail page
    await _fetchParkingLocationDetails(locationId);
  }

  Future<void> _fetchParkingLocationDetails(String id) async {
    try {
      await ApiService.getParkingLocationDetails(id);
      Navigator.push(
        context,
        MaterialPageRoute(
          builder: (context) => LocationDetail(
            locationId: id,
          ),
        ),
      );
    } catch (e) {
      print('Failed to load parking location details: $e');
    }
  }

  Future<void> _fetchParkingLocations() async {
    try {
      final data = await ApiService.getParkingLocations();
      setState(() {
        locations = data.map((item) => item['address'] as String).toList();
        filteredLocations = locations;
        locationCoordinates = {
          for (var item in data)
            item['address']: LatLng(item['lat'], item['lon']),
        };
        locationIds = {
          for (var item in data) item['address']: item['id'].toString(),
        };
      });
    } catch (e) {
      print('Failed to load parking locations: $e');
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Stack(
        children: [
          content(),
          SlidingUpPanel(
            controller: _panelController,
            minHeight: 60.0, // Reduced minimum height
            maxHeight:
                MediaQuery.of(context).size.height * 0.6, // Adjust as necessary
            panel: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                Container(
                  padding: const EdgeInsets.all(8.0), // Reduced padding
                  child: TextField(
                    decoration: InputDecoration(
                      hintText: 'Search locations...',
                      prefixIcon: const Icon(Icons.search, size: 20),
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(8.0),
                      ),
                    ),
                    onChanged: searchLocations,
                  ),
                ),
                Expanded(
                  child: Container(
                    decoration: BoxDecoration(
                      color: Colors.grey[200],
                      borderRadius: const BorderRadius.only(
                        topLeft: Radius.circular(16.0),
                        topRight: Radius.circular(16.0),
                      ),
                    ),
                    child: ListView.builder(
                      padding: const EdgeInsets.all(8.0), // Reduced padding
                      itemCount: filteredLocations.length,
                      itemBuilder: (context, index) {
                        return ListTile(
                          title: Text(filteredLocations[index]),
                          onTap: () {
                            _onLocationSelected(filteredLocations[index]);
                          },
                        );
                      },
                    ),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget content() {
    return GoogleMap(
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
                target: LatLng(
                    _currentLocation!.latitude!, _currentLocation!.longitude!),
                zoom: 15,
              ),
            ),
          );
        }
      },
      markers: _createMarkers(),
      onTap: (LatLng latLng) {
        _selectedMarker = null;
      },
    );
  }

  Set<Marker> _createMarkers() {
    Set<Marker> markers = locationCoordinates.entries.map((entry) {
      return Marker(
        markerId: MarkerId(entry.key),
        position: entry.value,
        infoWindow: InfoWindow(title: entry.key),
        onTap: () async {
          final locationName = entry.key;
          final locationId = locationIds[locationName];
          if (locationId != null) {
            await _fetchParkingLocationDetails(locationId);
          }
        },
      );
    }).toSet();

    if (_selectedMarker != null) {
      markers.add(_selectedMarker!);
    }

    return markers;
  }
}
