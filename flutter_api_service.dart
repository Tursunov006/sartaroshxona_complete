import 'dart:convert';
import 'package:flutter/foundation.dart' show kIsWeb;
import 'package:http/http.dart' as http;
import '../models/models.dart';

class ApiService {
  // ✅ Platformaga qarab avtomatik URL tanlaydi
  static String get baseUrl {
    if (kIsWeb) {
      return 'http://localhost:5000/api';          // Chrome
    }
    // Android emulator: 10.0.2.2
    // Haqiqiy telefon: kompyuter IP (ipconfig bilan toping)
    return 'http://10.0.2.2:5000/api';
  }

  // ── Xizmatlar ────────────────────────────────────────────────────────────
  static Future<List<ServiceModel>> getServices() async {
    try {
      final res = await http
          .get(Uri.parse('$baseUrl/services'))
          .timeout(const Duration(seconds: 3));
      if (res.statusCode == 200) {
        return (jsonDecode(res.body) as List)
            .map((e) => ServiceModel.fromJson(e))
            .toList();
      }
    } catch (_) {}
    return ServiceModel.defaults;
  }

  // ── Sartaroshlar ─────────────────────────────────────────────────────────
  static Future<List<BarberModel>> getBarbers() async {
    try {
      final res = await http
          .get(Uri.parse('$baseUrl/barbers'))
          .timeout(const Duration(seconds: 3));
      if (res.statusCode == 200) {
        return (jsonDecode(res.body) as List)
            .map((e) => BarberModel.fromJson(e))
            .toList();
      }
    } catch (_) {}
    return BarberModel.defaults;
  }

  // ── Bron yaratish ─────────────────────────────────────────────────────────
  static Future<Map<String, dynamic>> createBooking({
    required String customerName,
    required String customerPhone,
    required String serviceId,
    required String barberId,
    required String date,
    required String time,
  }) async {
    try {
      final res = await http
          .post(
            Uri.parse('$baseUrl/bookings'),
            headers: {'Content-Type': 'application/json'},
            body: jsonEncode({
              'customerName':  customerName,
              'customerPhone': customerPhone,
              'serviceId':     serviceId,
              'barberId':      barberId,
              'date':          date,
              'time':          time,
            }),
          )
          .timeout(const Duration(seconds: 8));

      if (res.statusCode == 201) {
        final data = jsonDecode(res.body);
        return {
          'success': true,
          'booking': data['booking'],
          'message': data['message'],
        };
      }

      // Conflict (409) — vaqt band
      if (res.statusCode == 409) {
        final data = jsonDecode(res.body);
        return {'success': false, 'error': data['error']};
      }

      final err = jsonDecode(res.body);
      return {'success': false, 'error': err['error'] ?? 'Xatolik'};

    } catch (e) {
      // Demo rejim — backend yo'q bo'lsa ham ishlaydi
      return {'success': true, 'demo': true};
    }
  }

  // ── Test ulanish ──────────────────────────────────────────────────────────
  static Future<bool> testConnection() async {
    try {
      final res = await http
          .get(Uri.parse('$baseUrl/test'))
          .timeout(const Duration(seconds: 3));
      return res.statusCode == 200;
    } catch (_) {
      return false;
    }
  }
}
