import 'package:flutter/material.dart';
import 'package:khalti_flutter/khalti_flutter.dart';

class PaymentService {
  final BuildContext context;
  final void Function(int) onPaymentSuccess;

  PaymentService(this.context, this.onPaymentSuccess);

  void initiateKhaltiPayment(int amount) {
    KhaltiScope.of(context).pay(
      config: PaymentConfig(
        amount: amount * 100, // Amount in paisa, e.g., Rs 10 = 1000 paisa
        productIdentity: 'product_id_1234',
        productName: 'Product Name',
      ),
      preferences: [
        PaymentPreference.khalti,
      ],
      onSuccess: (successModel) {
        // Call the success callback with the amount
        onPaymentSuccess(amount);
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Payment Successful: ${successModel.idx}')),
        );
      },
      onFailure: (failureModel) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Payment Failed: ${failureModel.message}')),
        );
      },
      onCancel: () {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Payment Cancelled')),
        );
      },
    );
  }
}
