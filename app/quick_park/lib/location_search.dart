import 'package:flutter/material.dart';
import 'package:sliding_up_panel/sliding_up_panel.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:latlong2/latlong.dart';

class SlideUpPanel extends StatefulWidget {
  @override
  _SlideUpPanelState createState() => _SlideUpPanelState();
}

class _SlideUpPanelState extends State<SlideUpPanel> {
  late List<String> locations;
  late List<String> filteredLocations;

  @override
  void initState() {
    super.initState();
    locations = ['Location 1', 'Location 2', 'Location 3', 'Location 4'];
    filteredLocations = locations;
  }

  void searchLocations(String query) {
    setState(() {
      filteredLocations = locations
          .where((location) =>
              location.toLowerCase().contains(query.toLowerCase()))
          .toList();
    });
  }

  @override
  Widget build(BuildContext context) {
    return SlidingUpPanel(
      panel: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Container(
            padding: const EdgeInsets.all(16.0),
            child: TextField(
              decoration: InputDecoration(
                hintText: 'Search locations...',
                prefixIcon: const Icon(Icons.search),
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
                padding: const EdgeInsets.all(16.0),
                itemCount: filteredLocations.length,
                itemBuilder: (context, index) {
                  return ListTile(
                    title: Text(filteredLocations[index]),
                    onTap: () {
                      // Add onTap functionality for location selection
                    },
                  );
                },
              ),
            ),
          ),
        ],
      ),
      body: content(),
    );
  }

  Widget content() {
    return FlutterMap(
      options: const MapOptions(
        initialCenter: LatLng(27.707087, 85.322759),
        initialZoom: 11,
        interactionOptions: InteractionOptions(
          flags: ~InteractiveFlag.doubleTapDragZoom,
        ),
      ),
      children: [openStreetMapTileLayer],
    );
  }
}

TileLayer get openStreetMapTileLayer => TileLayer(
      urlTemplate: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
      userAgentPackageName: 'dev.fleaflet.flutter_map.example',
    );
