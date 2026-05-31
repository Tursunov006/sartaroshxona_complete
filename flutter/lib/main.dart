import 'package:flutter/material.dart';
import 'pages/bookings_page.dart';
import 'pages/home_page.dart';
import 'pages/map_page.dart';
import 'pages/reviews_page.dart';
import 'pages/shops_page.dart';

void main() {
  runApp(const SartaroshxonaApp());
}

class SartaroshxonaApp extends StatelessWidget {
  const SartaroshxonaApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Sartaroshxona',
      theme: ThemeData(
        useMaterial3: true,
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.indigo),
      ),
      initialRoute: '/',
      routes: {
        '/': (_) => const HomePage(),
        '/booking': (_) => const BookingsPage(),
        '/shops': (_) => const ShopsPage(),
        '/reviews': (_) => const ReviewsPage(),
        '/map': (_) => const MapPage(),
      },
    );
  }
}
