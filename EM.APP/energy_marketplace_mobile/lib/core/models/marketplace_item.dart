class MarketplaceItem {
  final int productId;
  final double quantity;
  final String productName;
  final double purchasePricePerUnit;
  final double salePricePerUnit;
  final String? unit;

  const MarketplaceItem({
    required this.productId,
    required this.quantity,
    required this.productName,
    required this.purchasePricePerUnit,
    required this.salePricePerUnit,
    required this.unit,
  });

  factory MarketplaceItem.fromJson(Map<String, dynamic> json) {
    final quantityRaw = json['quantity'];
    final purchaseRaw = json['purchase_Price_Per_Unit'];
    final saleRaw = json['sale_Price_Per_Unit'];

    return MarketplaceItem(
      productId: json['product_Id'] as int,
      quantity: quantityRaw == null ? 0 : (quantityRaw as num).toDouble(),
      productName: json['product_Name'] as String,
      purchasePricePerUnit:
          purchaseRaw == null ? 0 : (purchaseRaw as num).toDouble(),
      salePricePerUnit:
          saleRaw == null ? 0 : (saleRaw as num).toDouble(),
      unit: json['unit'] as String?,
    );
  }
}