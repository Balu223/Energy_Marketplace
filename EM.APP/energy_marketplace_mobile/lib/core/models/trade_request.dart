class TradeRequest {
  final int productId;
  final int userId;
  final double quantity;

  TradeRequest({
    required this.productId,
    required this.userId,
    required this.quantity,
  });

  Map<String, dynamic> toJson() => {
        'productId': productId,
        'user_Id': userId,
        'quantity': quantity,
      };
}