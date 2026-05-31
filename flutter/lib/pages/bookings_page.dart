import 'package:flutter/material.dart';
import '../api_service.dart';
import '../models.dart';

class BookingsPage extends StatefulWidget {
  const BookingsPage({super.key});

  @override
  State<BookingsPage> createState() => _BookingsPageState();
}

class _BookingsPageState extends State<BookingsPage> {
  final _formKey = GlobalKey<FormState>();
  final _nameController = TextEditingController();
  final _phoneController = TextEditingController();
  String? _selectedServiceId;
  String? _selectedBarberId;
  DateTime? _selectedDate;
  TimeOfDay? _selectedTime;

  List<ServiceModel> _services = [];
  List<BarberModel> _barbers = [];
  bool _loading = false;
  String? _resultMessage;

  @override
  void initState() {
    super.initState();
    _loadLists();
  }

  Future<void> _loadLists() async {
    final services = await ApiService.getServices();
    final barbers = await ApiService.getBarbers();
    setState(() {
      _services = services;
      _barbers = barbers;
      if (_services.isNotEmpty && _selectedServiceId == null) {
        _selectedServiceId = _services.first.id;
      }
      if (_barbers.isNotEmpty && _selectedBarberId == null) {
        _selectedBarberId = _barbers.first.id;
      }
    });
  }

  Future<void> _sendBooking() async {
    if (!_formKey.currentState!.validate()) return;
    if (_selectedServiceId == null || _selectedBarberId == null || _selectedDate == null || _selectedTime == null) {
      setState(() => _resultMessage = 'Iltimos barcha maydonlarni to`ldiring.');
      return;
    }

    setState(() {
      _loading = true;
      _resultMessage = null;
    });

    final date = '${_selectedDate!.year}-${_selectedDate!.month.toString().padLeft(2, '0')}-${_selectedDate!.day.toString().padLeft(2, '0')}';
    final time = '${_selectedTime!.hour.toString().padLeft(2, '0')}:${_selectedTime!.minute.toString().padLeft(2, '0')}';

    final response = await ApiService.createBooking(
      customerName: _nameController.text.trim(),
      customerPhone: _phoneController.text.trim(),
      serviceId: _selectedServiceId!,
      barberId: _selectedBarberId!,
      date: date,
      time: time,
    );

    setState(() {
      _loading = false;
      _resultMessage = response['success'] == true ? 'Broningiz qabul qilindi!' : 'Xatolik: ${response['error'] ?? 'Noma`lum'}';
    });
  }

  Future<void> _pickDate() async {
    final now = DateTime.now();
    final date = await showDatePicker(
      context: context,
      initialDate: now,
      firstDate: now,
      lastDate: now.add(const Duration(days: 90)),
    );
    if (date != null) {
      setState(() => _selectedDate = date);
    }
  }

  Future<void> _pickTime() async {
    final time = await showTimePicker(context: context, initialTime: TimeOfDay.now());
    if (time != null) {
      setState(() => _selectedTime = time);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Bron qilish')),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Form(
          key: _formKey,
          child: ListView(
            children: [
              TextFormField(
                controller: _nameController,
                decoration: const InputDecoration(labelText: 'Ism va familiya'),
                validator: (value) => value?.trim().isEmpty == true ? 'Ismingizni kiriting' : null,
              ),
              const SizedBox(height: 12),
              TextFormField(
                controller: _phoneController,
                decoration: const InputDecoration(labelText: 'Telefon raqam'),
                keyboardType: TextInputType.phone,
                validator: (value) => value?.trim().isEmpty == true ? 'Telefon kiriting' : null,
              ),
              const SizedBox(height: 12),
              DropdownButtonFormField<String>(
                value: _selectedServiceId,
                decoration: const InputDecoration(labelText: 'Xizmat'),
                items: _services
                    .map((service) => DropdownMenuItem(value: service.id, child: Text(service.title)))
                    .toList(),
                onChanged: (value) => setState(() => _selectedServiceId = value),
              ),
              const SizedBox(height: 12),
              DropdownButtonFormField<String>(
                value: _selectedBarberId,
                decoration: const InputDecoration(labelText: 'Sartarosh'),
                items: _barbers
                    .map((barber) => DropdownMenuItem(value: barber.id, child: Text(barber.name)))
                    .toList(),
                onChanged: (value) => setState(() => _selectedBarberId = value),
              ),
              const SizedBox(height: 12),
              ListTile(
                title: const Text('Sana'),
                subtitle: Text(_selectedDate != null ? '${_selectedDate!.year}-${_selectedDate!.month}-${_selectedDate!.day}' : 'Sana tanlanmadi'),
                trailing: const Icon(Icons.calendar_today),
                onTap: _pickDate,
              ),
              ListTile(
                title: const Text('Vaqt'),
                subtitle: Text(_selectedTime != null ? _selectedTime!.format(context) : 'Vaqt tanlanmadi'),
                trailing: const Icon(Icons.access_time),
                onTap: _pickTime,
              ),
              const SizedBox(height: 20),
              ElevatedButton(
                onPressed: _loading ? null : _sendBooking,
                child: _loading ? const CircularProgressIndicator() : const Text('Bron qo`yish'),
              ),
              if (_resultMessage != null) ...[
                const SizedBox(height: 16),
                Text(_resultMessage!, style: const TextStyle(fontWeight: FontWeight.w600)),
              ],
            ],
          ),
        ),
      ),
    );
  }
}
