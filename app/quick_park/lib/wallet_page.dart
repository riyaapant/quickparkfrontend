import 'package:flutter/material.dart';
import 'payment_service.dart';

class WalletPage extends StatefulWidget {
  const WalletPage({super.key});

  @override
  _WalletPageState createState() => _WalletPageState();
}

class _WalletPageState extends State<WalletPage> {
  final TextEditingController _amountController = TextEditingController();
  int _availablePoints = 1000;
  String? _errorMessage;

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
    paymentService.initiateKhaltiPayment(amount);
  }

  void _onPaymentSuccess(int amount) {
    setState(() {
      _availablePoints += amount;
    });
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
            Text(
              'Available Points: $_availablePoints',
              style: const TextStyle(fontSize: 16),
            ),
            const SizedBox(height: 16), // Increased height for more space
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
            const SizedBox(height: 16), // Adjusted spacing before the button
            Center(
              child: ElevatedButton(
                onPressed: _handleTopUp,
                child: const Text('Top Up'),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
