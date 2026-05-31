class ServiceModel {
  final String id;
  final String title;
  final String description;
  final double price;

  ServiceModel({
    required this.id,
    required this.title,
    required this.description,
    required this.price,
  });

  factory ServiceModel.fromJson(Map<String, dynamic> json) {
    return ServiceModel(
      id: json['id']?.toString() ?? '',
      title: json['title']?.toString() ?? "Noma'lum xizmat",
      description: json['description']?.toString() ?? '',
      price: double.tryParse(json['price']?.toString() ?? '') ?? 0.0,
    );
  }
}

class BarberModel {
  final String id;
  final String name;
  final String phone;
  final String instagram;
  final String bio;
  final String imageUrl;

  BarberModel({
    required this.id,
    required this.name,
    required this.phone,
    required this.instagram,
    required this.bio,
    required this.imageUrl,
  });

  factory BarberModel.fromJson(Map<String, dynamic> json) {
    return BarberModel(
      id: json['id']?.toString() ?? '',
      name: json['name']?.toString() ?? "Noma'lum sartarosh",
      phone: json['phone']?.toString() ?? '',
      instagram: json['instagram']?.toString() ?? '',
      bio: json['bio']?.toString() ?? '',
      imageUrl: json['imageUrl']?.toString() ?? '',
    );
  }
}

class ShopModel {
  final String id;
  final String name;
  final String address;
  final String phone;
  final double? latitude;
  final double? longitude;
  final String instagram;

  ShopModel({
    required this.id,
    required this.name,
    required this.address,
    required this.phone,
    required this.latitude,
    required this.longitude,
    required this.instagram,
  });

  factory ShopModel.fromJson(Map<String, dynamic> json) {
    return ShopModel(
      id: json['id']?.toString() ?? '',
      name: json['name']?.toString() ?? "Noma'lum sartaroshxona",
      address: json['address']?.toString() ?? '',
      phone: json['phone']?.toString() ?? '',
      latitude: json['latitude'] != null ? double.tryParse(json['latitude'].toString()) : null,
      longitude: json['longitude'] != null ? double.tryParse(json['longitude'].toString()) : null,
      instagram: json['instagram']?.toString() ?? '',
    );
  }
}

class ReviewModel {
  final String id;
  final String author;
  final String comment;
  final int rating;
  final String shopId;
  final String barberId;

  ReviewModel({
    required this.id,
    required this.author,
    required this.comment,
    required this.rating,
    required this.shopId,
    required this.barberId,
  });

  factory ReviewModel.fromJson(Map<String, dynamic> json) {
    return ReviewModel(
      id: json['id']?.toString() ?? '',
      author: json['author']?.toString() ?? 'Mijoz',
      comment: json['comment']?.toString() ?? '',
      rating: int.tryParse(json['rating']?.toString() ?? '') ?? 0,
      shopId: json['shopId']?.toString() ?? '',
      barberId: json['barberId']?.toString() ?? '',
    );
  }
}
