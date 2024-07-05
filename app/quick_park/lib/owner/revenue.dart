import 'package:flutter/material.dart';
import '../services/api_service_owner.dart';
import 'dart:convert';

class RevenueCard extends StatefulWidget {
  const RevenueCard({Key? key}) : super(key: key);

  @override
  _RevenueCardState createState() => _RevenueCardState();
}

class _RevenueCardState extends State<RevenueCard> {
  double totalRevenue = 0.0;
  double dailyRevenue = 0.0;
  bool isLoading = true;
  String errorMessage = '';

  @override
  void initState() {
    super.initState();
    _fetchRevenueData();
  }

  Future<void> _fetchRevenueData() async {
    try {
      final response = await ApiServiceOwner.viewRevenue();
      if (response.statusCode == 200) {
        final List<dynamic> data = jsonDecode(response.body);
        if (mounted) {
          setState(() {
            totalRevenue = data.fold(0.0, (sum, item) {
              if (item['From'] != 'Khalti') {
                return sum + (item['Amount'] as num).toDouble();
              }
              return sum;
            });

            dailyRevenue = data.where((item) {
              DateTime date = DateTime.parse(item['Time']);
              return date
                  .isAfter(DateTime.now().subtract(const Duration(days: 1)));
            }).fold(0.0, (sum, item) {
              if (item['From'] != 'Khalti') {
                return sum + (item['Amount'] as num).toDouble();
              }
              return sum;
            });

            isLoading = false;
          });
        }
      } else {
        if (mounted) {
          setState(() {
            errorMessage = 'Failed to load revenue data';
            isLoading = false;
          });
        }
      }
    } catch (e) {
      if (mounted) {
        setState(() {
          errorMessage = 'Error: $e';
          isLoading = false;
        });
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    if (isLoading) {
      return const Center(child: CircularProgressIndicator());
    }
    if (errorMessage.isNotEmpty) {
      return Center(child: Text(errorMessage));
    }
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(16),
      child: Card(
        elevation: 4,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text(
                'Revenue Summary',
                style: TextStyle(
                  fontSize: 20,
                  fontWeight: FontWeight.bold,
                  color: Color(0xFF265073),
                ),
              ),
              const SizedBox(height: 16),
              Text(
                'Total Revenue: Rs ${totalRevenue.toStringAsFixed(2)}',
                style: const TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(height: 8),
              Text(
                'Daily Revenue: Rs ${dailyRevenue.toStringAsFixed(2)}',
                style: const TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
