import 'dart:developer';
import 'package:flutter/material.dart';
import 'package:khalti_checkout_flutter/khalti_checkout_flutter.dart';
import './services/api_service.dart';

class PaymentService {
  final BuildContext context;
  final Function(int) onPaymentSuccess;

  PaymentService(this.context, this.onPaymentSuccess);

  void initiateKhaltiPayment(int amount) async {
    try {
      final pidx = await ApiService.generatePidx(amount);

      if (pidx == null) {
        throw Exception('Failed to get pidx');
      }

      final payConfig = KhaltiPayConfig(
        publicKey:
            'd989b57ed97841f0aacff695a0a4eb8c', // Replace with your live public key
        pidx: pidx,
        returnUrl: Uri.parse('https://docs.khalti.com/khalti-epayment/'),
        environment: Environment.test,
      );

      final Future<Khalti?> khalti = Khalti.init(
        enableDebugging: true,
        payConfig: payConfig,
        onPaymentResult: (paymentResult, khalti) async {
          log(paymentResult.toString());
          khalti.close(context);
        },
        onMessage: (
          khalti, {
          description,
          statusCode,
          event,
          needsPaymentConfirmation,
        }) async {
          log(
            'Description: $description, Status Code: $statusCode, Event: $event, NeedsPaymentConfirmation: $needsPaymentConfirmation',
          );
          khalti.close(context);
        },
        onReturn: () async {
          log('Successfully redirected to return_url.');
          final verificationResult = await ApiService.verifyTopUp(pidx);
          if (verificationResult) {
            onPaymentSuccess(amount);
          } else {
            log('Payment verification failed');
          }
        },
      );

      khalti.then((khaltiInstance) {
        if (khaltiInstance != null) {
          khaltiInstance.open(context);
        }
      });
    } catch (e) {
      log('Error initiating Khalti payment: $e');
    }
  }
}
