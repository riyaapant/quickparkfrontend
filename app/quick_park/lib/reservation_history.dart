import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'services/api_service.dart';

class ReservationHistoryPage extends StatefulWidget {
  const ReservationHistoryPage({super.key});

  @override
  _ReservationHistoryPageState createState() => _ReservationHistoryPageState();
}

class _ReservationHistoryPageState extends State<ReservationHistoryPage> {
  late Future<List<Map<String, dynamic>>> reservationHistory;

  @override
  void initState() {
    super.initState();
    reservationHistory = ApiService.getReservationHistory();
  }

  String formatDate(String? dateTimeStr) {
    if (dateTimeStr == null) return 'N/A';
    final dateTime = DateTime.parse(dateTimeStr);
    return DateFormat.yMMMMd().format(dateTime);
  }

  String formatTime(String? dateTimeStr) {
    if (dateTimeStr == null) return 'N/A';
    final dateTime = DateTime.parse(dateTimeStr);
    return DateFormat.jm().format(dateTime);
  }

  List<Map<String, dynamic>> sortReservations(
      List<Map<String, dynamic>> reservations) {
    reservations.sort((a, b) => DateTime.parse(b['start_time'])
        .compareTo(DateTime.parse(a['start_time'])));
    return reservations;
  }

  Map<String, List<Map<String, dynamic>>> groupByDate(
      List<Map<String, dynamic>> reservations) {
    final Map<String, List<Map<String, dynamic>>> groupedData = {};
    for (var reservation in reservations) {
      final date = formatDate(reservation['start_time']);
      if (groupedData.containsKey(date)) {
        groupedData[date]!.add(reservation);
      } else {
        groupedData[date] = [reservation];
      }
    }
    return groupedData;
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Reservation History'),
      ),
      body: FutureBuilder<List<Map<String, dynamic>>>(
        future: reservationHistory,
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator());
          } else if (snapshot.hasError) {
            return Center(child: Text('Error: ${snapshot.error}'));
          } else if (!snapshot.hasData || snapshot.data!.isEmpty) {
            return const Center(
                child: Text('No reservation history available.'));
          }

          final reservations = sortReservations(snapshot.data!);
          final groupedReservations = groupByDate(reservations);

          return ListView.builder(
            itemCount: groupedReservations.keys.length,
            itemBuilder: (context, index) {
              final date = groupedReservations.keys.elementAt(index);
              final reservationsForDate = groupedReservations[date]!;

              return Padding(
                padding: const EdgeInsets.all(8.0),
                child: Card(
                  elevation: 5,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(10.0),
                  ),
                  child: ExpansionTile(
                    title: Text(
                      date,
                      style: const TextStyle(
                        fontWeight: FontWeight.bold,
                        fontSize: 18,
                      ),
                    ),
                    children: reservationsForDate.map((reservation) {
                      return ListTile(
                        title: Text(
                          reservation['address'] ?? 'N/A',
                          style: const TextStyle(fontWeight: FontWeight.bold),
                        ),
                        subtitle: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const SizedBox(height: 5),
                            Text(
                                'Start: ${formatTime(reservation['start_time'])}'),
                            Text('End: ${formatTime(reservation['end_time'])}'),
                            const SizedBox(height: 10),
                          ],
                        ),
                        trailing: Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            const Text(
                              'Amount',
                              style:
                                  TextStyle(fontSize: 14, color: Colors.grey),
                            ),
                            const SizedBox(height: 2),
                            Text(
                              'Rs ${reservation['total_amount'] ?? 'N/A'}',
                              style: const TextStyle(
                                fontWeight: FontWeight.bold,
                                fontSize: 16,
                              ),
                            ),
                          ],
                        ),
                      );
                    }).toList(),
                  ),
                ),
              );
            },
          );
        },
      ),
    );
  }
}
