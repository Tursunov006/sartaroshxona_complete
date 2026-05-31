import 'package:flutter/material.dart';
import '../api_service.dart';
import '../models.dart';

class ShopsPage extends StatelessWidget {
  const ShopsPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Sartaroshxonalar')),
      body: FutureBuilder<List<ShopModel>>(
        future: ApiService.getShops(),
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator());
          }
          if (snapshot.hasError || snapshot.data == null || snapshot.data!.isEmpty) {
            return const Center(child: Text('Sartaroshxonalar topilmadi.'));
          }
          final shops = snapshot.data!;
          return ListView.builder(
            padding: const EdgeInsets.all(16),
            itemCount: shops.length,
            itemBuilder: (context, index) {
              final shop = shops[index];
              return Card(
                margin: const EdgeInsets.only(bottom: 12),
                child: ListTile(
                  title: Text(shop.name),
                  subtitle: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      if (shop.address.isNotEmpty) Text(shop.address),
                      if (shop.phone.isNotEmpty) Text('Tel: ${shop.phone}'),
                      if (shop.instagram.isNotEmpty) Text('Instagram: @${shop.instagram}'),
                    ],
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
