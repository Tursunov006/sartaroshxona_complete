import 'package:flutter/material.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:latlong2/latlong.dart';
import '../api_service.dart';
import '../models.dart';

class MapPage extends StatelessWidget {
  const MapPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Xarita bo"yicha qidirish')),
      body: FutureBuilder<List<ShopModel>>(
        future: ApiService.getShops(),
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator());
          }
          if (snapshot.hasError || snapshot.data == null || snapshot.data!.isEmpty) {
            return const Center(child: Text('Sartaroshxonalar yuklanmadi.'));
          }
          final shops = snapshot.data!.where((shop) => shop.latitude != null && shop.longitude != null).toList();
          final center = shops.isNotEmpty
              ? LatLng(shops.first.latitude!, shops.first.longitude!)
              : LatLng(41.311081, 69.240562);

          return FlutterMap(
            options: MapOptions(center: center, zoom: 13),
            children: [
              TileLayer(
                urlTemplate: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
                subdomains: const ['a', 'b', 'c'],
              ),
              MarkerLayer(
                markers: shops
                    .map(
                      (shop) => Marker(
                        point: LatLng(shop.latitude!, shop.longitude!),
                        width: 180,
                        height: 60,
                        builder: (context) => GestureDetector(
                          onTap: () {
                            showModalBottomSheet(
                              context: context,
                              builder: (_) => Padding(
                                padding: const EdgeInsets.all(16),
                                child: Column(
                                  mainAxisSize: MainAxisSize.min,
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Text(shop.name, style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                                    const SizedBox(height: 8),
                                    Text(shop.address),
                                    if (shop.phone.isNotEmpty) Text('Tel: ${shop.phone}'),
                                    if (shop.instagram.isNotEmpty) Text('Instagram: @${shop.instagram}'),
                                  ],
                                ),
                              ),
                            );
                          },
                          child: const Icon(Icons.location_on, color: Colors.red, size: 40),
                        ),
                      ),
                    )
                    .toList(),
              ),
            ],
          );
        },
      ),
    );
  }
}
