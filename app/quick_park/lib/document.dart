import 'package:flutter/material.dart';
import 'package:file_picker/file_picker.dart';
import 'dart:io';
import 'services/api_service.dart';
import 'dashboard.dart';

class DocumentPage extends StatefulWidget {
  const DocumentPage({super.key});

  @override
  _DocumentPageState createState() => _DocumentPageState();
}

class _DocumentPageState extends State<DocumentPage> {
  bool isLoading = false;
  final _formKey = GlobalKey<FormState>();
  final TextEditingController _vehicleIdController = TextEditingController();
  File? _selectedFile;

  Future<void> _pickDocument() async {
    FilePickerResult? result = await FilePicker.platform.pickFiles(
      type: FileType.custom,
      allowedExtensions: ['pdf'],
    );

    if (result != null) {
      setState(() {
        _selectedFile = File(result.files.single.path!);
      });
    }
  }

  void _removeDocument() {
    setState(() {
      _selectedFile = null;
    });
  }

  void _continueProcess() async {
    if (_formKey.currentState!.validate() && _selectedFile != null) {
      setState(() {
        isLoading = true;
      });

      try {
        // Upload PDF
        await ApiService.uploadPdf(_selectedFile!);

        // Update Vehicle ID
        await ApiService.updateVehicleId(_vehicleIdController.text);

        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
              content: Text(
                  'Document uploaded and Vehicle ID updated successfully')),
        );
        _proceedToDashboard();
      } catch (e) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Error: ${e.toString()}')),
        );
      }

      setState(() {
        isLoading = false;
      });
    } else if (_selectedFile == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please select a PDF document')),
      );
    }
  }

  void _proceedToDashboard() {
    Navigator.pushReplacement(
      context,
      MaterialPageRoute(builder: (context) => const DashboardPage()),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Upload Document & Vehicle ID'),
      ),
      body: SingleChildScrollView(
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: <Widget>[
              const Text(
                "Let's get you verified",
                style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 16),
              const Text(
                "Please upload a PDF document for verification and provide your Vehicle ID. You can skip this step, but you won't be able to access full features.",
                style: TextStyle(fontSize: 16),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 32),
              isLoading
                  ? const CircularProgressIndicator()
                  : Column(
                      children: [
                        if (_selectedFile == null)
                          ElevatedButton(
                            onPressed: _pickDocument,
                            child: const Text('Select PDF Document'),
                          )
                        else
                          Column(
                            children: [
                              Text(
                                  'Selected file: ${_selectedFile!.path.split('/').last}'),
                              ElevatedButton(
                                onPressed: _removeDocument,
                                child: const Text('Remove PDF'),
                              ),
                            ],
                          ),
                        const SizedBox(height: 24),
                        Form(
                          key: _formKey,
                          child: TextFormField(
                            controller: _vehicleIdController,
                            decoration: const InputDecoration(
                              labelText: 'Vehicle ID',
                              border: OutlineInputBorder(),
                            ),
                            validator: (value) {
                              if (value == null || value.isEmpty) {
                                return 'Please enter a vehicle ID';
                              }
                              final regex = RegExp(r'^B[A-Z]{2}\d{4}$');
                              if (!regex.hasMatch(value)) {
                                return 'Invalid vehicle ID format';
                              }
                              return null;
                            },
                          ),
                        ),
                        const SizedBox(height: 24),
                        ElevatedButton(
                          onPressed: _continueProcess,
                          child: const Text('Continue'),
                        ),
                        const SizedBox(height: 16),
                        TextButton(
                          onPressed: _proceedToDashboard,
                          child: const Text('Skip for now'),
                        ),
                      ],
                    ),
            ],
          ),
        ),
      ),
    );
  }
}
