import 'dart:convert';
import 'package:flutter/foundation.dart';
import 'package:http/http.dart' as http;
import 'models.dart';

class ApiService {
  static String get baseUrl {
    if (kIsWeb) {
      return 'http://localhost:5000/api';
    }
    return 'http://10.0.2.2:5000/api';
  }

  static Future<List<ServiceModel>> getServices() async {
    final url = Uri.parse('\$baseUrl/services');
    try {
      final response = await http.get(url).timeout(const Duration(seconds: 5));
      if (response.statusCode == 200) {
        return (jsonDecode(response.body) as List)
            .map((e) => ServiceModel.fromJson(e as Map<String, dynamic>))
            .toList();
      }
    } catch (_) {}
    return [];
  }

  static Future<List<BarberModel>> getBarbers() async {
    final url = Uri.parse('\$baseUrl/barbers');
    try {
      final response = await http.get(url).timeout(const Duration(seconds: 5));
      if (response.statusCode == 200) {
        return (jsonDecode(response.body) as List)
            .map((e) => BarberModel.fromJson(e as Map<String, dynamic>))
            .toList();
      }
    } catch (_) {}
    return [];
  }

  static Future<List<ShopModel>> getShops() async {
    final url = Uri.parse('\$baseUrl/shops');
    try {
      final response = await http.get(url).timeout(const Duration(seconds: 5));
      if (response.statusCode == 200) {
        return (jsonDecode(response.body) as List)
            .map((e) => ShopModel.fromJson(e as Map<String, dynamic>))
            .toList();
      }
    } catch (_) {}
    return [];
  }

  static Future<List<ShopModel>> getNearbyShops(double latitude, double longitude) async {
    final url = Uri.parse('\$baseUrl/shops/nearby?lat=\$latitude&lng=\$longitude');
    try {
      final response = await http.get(url).timeout(const Duration(seconds: 5));
      if (response.statusCode == 200) {
        return (jsonDecode(response.body) as List)
            .map((e) => ShopModel.fromJson(e as Map<String, dynamic>))
            .toList();
      }
    } catch (_) {}
    return [];
  }

  static Future<List<ReviewModel>> getReviews() async {
    final url = Uri.parse('\$baseUrl/reviews');
    try {
      final response = await http.get(url).timeout(const Duration(seconds: 5));
      if (response.statusCode == 200) {
        return (jsonDecode(response.body) as List)
            .map((e) => ReviewModel.fromJson(e as Map<String, dynamic>))
            .toList();
      }
    } catch (_) {}
    return [];
  }

  static Future<Map<String, dynamic>> postReview({
    required String author,
    required String comment,
    required int rating,
    String? shopId,
    String? barberId,
  }) async {
    final url = Uri.parse('\$baseUrl/reviews');
    try {
      final response = await http.post(
        url,
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'author': author,
          'comment': comment,
          'rating': rating,
          'shopId': shopId,
          'barberId': barberId,
        }),
      ).timeout(const Duration(seconds: 8));

      final body = jsonDecode(response.body);
      if (response.statusCode == 201 || response.statusCode == 200) {
        return {'success': true, 'message': body['message'] ?? 'Sharh joylandi'};
      }
      return {'success': false, 'error': body['error'] ?? 'Xatolik yuz berdi'};
    } catch (e) {
      return {'success': false, 'error': "Tarmoq bilan bog'lanishda xatolik"};
    }
  }

  static Future<Map<String, dynamic>> createBooking({
    required String customerName,
    required String customerPhone,
    required String serviceId,
    required String barberId,
    required String date,
    required String time,
  }) async {
    final url = Uri.parse('\$baseUrl/bookings');
    try {
      final response = await http.post(
        url,
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'customerName': customerName,
          'customerPhone': customerPhone,
          'serviceId': serviceId,
          'barberId': barberId,
          'date': date,
          'time': time,
        }),
      ).timeout(const Duration(seconds: 8));

      final body = jsonDecode(response.body);
      if (response.statusCode == 201) {
        return {'success': true, 'message': body['message'] ?? 'Bron muvaffaqiyatli yaratildi'};
      }
      return {'success': false, 'error': body['error'] ?? 'Xatolik yuz berdi'};
    } catch (e) {
      return {'success': false, 'error': "Tarmoq bilan bog'lanishda xatolik"};
    }
  }

  static Future<bool> testConnection() async {
    final url = Uri.parse('\$baseUrl/test');
    try {
      final response = await http.get(url).timeout(const Duration(seconds: 3));
      return response.statusCode == 200;
    } catch (_) {
      return false;
    }
  }
}
