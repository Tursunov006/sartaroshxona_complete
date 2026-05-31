import 'package:flutter/material.dart';
import '../api_service.dart';
import '../models.dart';

class HomePage extends StatelessWidget {
  const HomePage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Sartaroshxona')), 
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text('Xush kelibsiz!', style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold)),
            const SizedBox(height: 8),
            const Text('Bron qilish, sartaroshxonalarni ko"rish, xaritada izlash, va sharh qoldirish uchun ilova.'),
            const SizedBox(height: 20),
            _HomeButton(title: 'Bron qilish', route: '/booking', icon: Icons.calendar_month),
            _HomeButton(title: 'Sartaroshxonalar', route: '/shops', icon: Icons.store),
            _HomeButton(title: 'Xarita bo"yicha qidirish', route: '/map', icon: Icons.map),
            _HomeButton(title: 'Sharhlar', route: '/reviews', icon: Icons.star),
            const SizedBox(height: 30),
            const Text('Mashhur xizmatlar', style: TextStyle(fontSize: 18, fontWeight: FontWeight.w600)),
            const SizedBox(height: 12),
            FutureBuilder<List<ServiceModel>>(
              future: ApiService.getServices(),
              builder: (context, snapshot) {
                if (snapshot.connectionState == ConnectionState.waiting) {
                  return const Center(child: CircularProgressIndicator());
                }
                if (snapshot.hasError || snapshot.data == null || snapshot.data!.isEmpty) {
                  return const Text('Xizmatlar yuklanmadi.');
                }
                return Column(
                  children: snapshot.data!
                      .map((service) => Card(
                            margin: const EdgeInsets.symmetric(vertical: 8),
                            child: ListTile(
                              title: Text(service.title),
                              subtitle: Text(service.description),
                              trailing: Text('${service.price.toStringAsFixed(0)} so`m'),
                            ),
                          ))
                      .toList(),
                );
              },
            ),
            const SizedBox(height: 20),
            const Text('Sartaroshlar', style: TextStyle(fontSize: 18, fontWeight: FontWeight.w600)),
            const SizedBox(height: 12),
            FutureBuilder<List<BarberModel>>(
              future: ApiService.getBarbers(),
              builder: (context, snapshot) {
                if (snapshot.connectionState == ConnectionState.waiting) {
                  return const Center(child: CircularProgressIndicator());
                }
                if (snapshot.hasError || snapshot.data == null || snapshot.data!.isEmpty) {
                  return const Text('Sartaroshlar yuklanmadi.');
                }
                return Column(
                  children: snapshot.data!
                      .take(3)
                      .map((barber) => Card(
                            margin: const EdgeInsets.symmetric(vertical: 8),
                            child: ListTile(
                              title: Text(barber.name),
                              subtitle: Text(barber.bio),
                              trailing: Text(barber.instagram.isNotEmpty ? '@${barber.instagram}' : ''),
                            ),
                          ))
                      .toList(),
                );
              },
            ),
          ],
        ),
      ),
    );
  }
}

class _HomeButton extends StatelessWidget {
  final String title;
  final String route;
  final IconData icon;

  const _HomeButton({required this.title, required this.route, required this.icon});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8),
      child: ElevatedButton.icon(
        onPressed: () => Navigator.pushNamed(context, route),
        icon: Icon(icon),
        label: Text(title),
        style: ElevatedButton.styleFrom(minimumSize: const Size.fromHeight(50)),
      ),
    );
  }
}
