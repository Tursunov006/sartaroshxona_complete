import 'package:flutter/material.dart';
import '../api_service.dart';
import '../models.dart';

class ReviewsPage extends StatefulWidget {
  const ReviewsPage({super.key});

  @override
  State<ReviewsPage> createState() => _ReviewsPageState();
}

class _ReviewsPageState extends State<ReviewsPage> {
  final _authorController = TextEditingController();
  final _commentController = TextEditingController();
  int _rating = 5;
  String? _shopId;
  String? _barberId;
  bool _submitting = false;
  String? _message;

  List<ShopModel> _shops = [];
  List<BarberModel> _barbers = [];

  @override
  void initState() {
    super.initState();
    _loadResources();
  }

  Future<void> _loadResources() async {
    final shops = await ApiService.getShops();
    final barbers = await ApiService.getBarbers();
    setState(() {
      _shops = shops;
      _barbers = barbers;
      if (_shops.isNotEmpty) _shopId = _shops.first.id;
      if (_barbers.isNotEmpty) _barberId = _barbers.first.id;
    });
  }

  Future<void> _submitReview() async {
    if (_authorController.text.trim().isEmpty || _commentController.text.trim().isEmpty) {
      setState(() => _message = 'Ism va sharhni to`ldiring.');
      return;
    }
    setState(() {
      _submitting = true;
      _message = null;
    });
    final result = await ApiService.postReview(
      author: _authorController.text.trim(),
      comment: _commentController.text.trim(),
      rating: _rating,
      shopId: _shopId,
      barberId: _barberId,
    );
    setState(() {
      _submitting = false;
      _message = result['success'] == true ? 'Sharh muvaffaqiyatli yuborildi.' : 'Xatolik: ${result['error'] ?? 'Noma`lum'}';
      if (result['success'] == true) {
        _authorController.clear();
        _commentController.clear();
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Sharhlar')),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          const Text('Yangi sharh qoldirish', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
          const SizedBox(height: 12),
          TextField(
            controller: _authorController,
            decoration: const InputDecoration(labelText: 'Ism'),
          ),
          const SizedBox(height: 12),
          TextField(
            controller: _commentController,
            decoration: const InputDecoration(labelText: 'Sharh'),
            maxLines: 3,
          ),
          const SizedBox(height: 12),
          DropdownButtonFormField<String>(
            value: _shopId,
            decoration: const InputDecoration(labelText: 'Sartaroshxona tanlash'),
            items: _shops.map((shop) => DropdownMenuItem(value: shop.id, child: Text(shop.name))).toList(),
            onChanged: (value) => setState(() => _shopId = value),
          ),
          const SizedBox(height: 12),
          DropdownButtonFormField<String>(
            value: _barberId,
            decoration: const InputDecoration(labelText: 'Sartarosh tanlash'),
            items: _barbers.map((barber) => DropdownMenuItem(value: barber.id, child: Text(barber.name))).toList(),
            onChanged: (value) => setState(() => _barberId = value),
          ),
          const SizedBox(height: 12),
          Row(
            children: [
              const Text('Reyting:'),
              const SizedBox(width: 12),
              DropdownButton<int>(
                value: _rating,
                items: List.generate(5, (index) => index + 1)
                    .map((value) => DropdownMenuItem(value: value, child: Text('$value')))
                    .toList(),
                onChanged: (value) => setState(() => _rating = value ?? _rating),
              ),
            ],
          ),
          const SizedBox(height: 20),
          ElevatedButton(
            onPressed: _submitting ? null : _submitReview,
            child: _submitting ? const CircularProgressIndicator() : const Text('Sharh yuborish'),
          ),
          if (_message != null) ...[
            const SizedBox(height: 16),
            Text(_message!, style: const TextStyle(fontWeight: FontWeight.w600)),
          ],
          const SizedBox(height: 24),
          const Text('Mavjud sharhlar', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
          const SizedBox(height: 12),
          FutureBuilder<List<ReviewModel>>(
            future: ApiService.getReviews(),
            builder: (context, snapshot) {
              if (snapshot.connectionState == ConnectionState.waiting) {
                return const Center(child: CircularProgressIndicator());
              }
              if (snapshot.hasError || snapshot.data == null || snapshot.data!.isEmpty) {
                return const Text('Hozircha sharh mavjud emas.');
              }
              return Column(
                children: snapshot.data!
                    .map((review) => Card(
                          margin: const EdgeInsets.symmetric(vertical: 8),
                          child: ListTile(
                            title: Text(review.author),
                            subtitle: Text(review.comment),
                            trailing: Text('⭐ ${review.rating}'),
                          ),
                        ))
                    .toList(),
              );
            },
          ),
        ],
      ),
    );
  }
}
