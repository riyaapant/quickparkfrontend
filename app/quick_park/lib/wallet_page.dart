import 'package:flutter/material.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'dart:convert';
import 'payment_service.dart';
import './services/api_service.dart';

class WalletPage extends StatefulWidget {
  const WalletPage({super.key});

  @override
  _WalletPageState createState() => _WalletPageState();
}

class _WalletPageState extends State<WalletPage> {
  final TextEditingController _amountController = TextEditingController();
  double _availableBalance = 0.0;
  String? _errorMessage;
  String? _pidx; // Add a variable to store the pidx
  final FlutterSecureStorage _secureStorage =
      FlutterSecureStorage(); // Add secure storage instance

  @override
  void initState() {
    super.initState();
    _fetchAvailableBalance(); // Fetch balance when the widget is initialized
    _loadPidx();
  }

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    _verifyTopUpIfNeeded();
  }

  Future<void> _fetchAvailableBalance() async {
    try {
      final response = await ApiService.getProfile();
      final profileData = jsonDecode(response.body);
      setState(() {
        _availableBalance = profileData['balance'];
      });
    } catch (e) {
      setState(() {
        _errorMessage = 'Failed to fetch balance';
      });
    }
  }

  Future<void> _loadPidx() async {
    String? storedPidx = await _secureStorage.read(key: 'pidx');
    setState(() {
      _pidx = storedPidx;
    });
  }

  Future<void> _savePidx(String pidx) async {
    await _secureStorage.write(key: 'pidx', value: pidx);
  }

  Future<void> _clearPidx() async {
    await _secureStorage.delete(key: 'pidx');
  }

  void _handleTopUp() {
    final amount = int.tryParse(_amountController.text);
    if (amount == null || amount <= 0) {
      setState(() {
        _errorMessage = 'Please enter a valid amount';
      });
      return;
    }

    setState(() {
      _errorMessage = null;
    });

    final paymentService = PaymentService(context, _onPaymentSuccess);
    paymentService.initiateKhaltiPayment(amount).then((pidx) {
      setState(() {
        _pidx = pidx;
      });
      _savePidx(pidx!); // Save the pidx locally, using null assertion operator
    });
  }

  void _onPaymentSuccess(int amount) async {
    if (_pidx != null) {
      final result = await ApiService.verifyTopUp(_pidx!);
      if (result) {
        setState(() {
          _availableBalance += amount;
        });
        _fetchAvailableBalance(); // Fetch the balance again to update the UI
        _clearPidx(); // Clear the pidx after successful verification
      } else {
        setState(() {
          _errorMessage = 'Payment verification failed';
        });
      }
    }
  }

  void _refreshBalance() async {
    _verifyTopUpIfNeeded();
  }

  void _verifyTopUpIfNeeded() async {
    if (_pidx != null) {
      final result = await ApiService.verifyTopUp(_pidx!);
      if (result) {
        _fetchAvailableBalance(); // Fetch the balance again to update the UI
        _clearPidx(); // Clear the pidx after successful verification
      } else {
        setState(() {
          _errorMessage = 'Failed to verify top-up';
        });
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Wallet'),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Card(
              elevation: 4,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(10),
              ),
              child: Padding(
                padding: const EdgeInsets.all(16.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      'Available Balance',
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                        color: Color(0xFF265073),
                      ),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      'Rupees (Rs): $_availableBalance',
                      style: const TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                        color: Color(0xFF265073),
                      ),
                    ),
                    const SizedBox(height: 16),
                    ElevatedButton(
                      onPressed: _refreshBalance,
                      child: const Text('Refresh Balance'),
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 24), // Increased height for more space
            const Text(
              'Top Up Wallet',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
                color: Color(0xFF265073),
              ),
            ),
            const SizedBox(height: 16),
            TextField(
              controller: _amountController,
              keyboardType: TextInputType.number,
              decoration: InputDecoration(
                labelText: 'Enter amount',
                border: const OutlineInputBorder(),
                errorText: _errorMessage,
                focusedBorder: OutlineInputBorder(
                  borderSide: BorderSide(
                    color: _errorMessage != null ? Colors.red : Colors.blue,
                  ),
                ),
              ),
            ),
            const SizedBox(height: 24), // Adjusted spacing before the button
            Center(
              child: ElevatedButton(
                onPressed: _handleTopUp,
                style: ElevatedButton.styleFrom(
                  backgroundColor: Color(0xFF5D2E8C), // Khalti purple color
                  padding: const EdgeInsets.symmetric(
                    horizontal: 24,
                    vertical: 12,
                  ),
                  textStyle: const TextStyle(
                    fontSize: 16,
                  ),
                ),
                child: const Text('Pay via Khalti',
                    style: TextStyle(color: Colors.white)),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
