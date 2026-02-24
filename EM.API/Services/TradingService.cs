using EM.API.Models;
using EM.API.Repositories;
using EM.API.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace EM.API.Services
{
    public class TradingService : ITradingService
    {
        private readonly MarketplaceDbContext _context;
        public TradingService(MarketplaceDbContext context)
        {
            _context = context;
        }
        public async Task BuyFromMarketAsync(TradeRequestDto request)
        {
            var userId = request.User_Id;
            var quantity = request.Quantity;
            var productId = request.ProductId;
            if (quantity <= 0)
                throw new ArgumentException("Quantity must be greater than zero.", nameof(quantity));

                var user = await _context.Users.FindAsync(userId)
                        ?? throw new InvalidOperationException($"User with ID {userId} not found.");
                var product = await _context.Products.FindAsync(productId)
                        ?? throw new InvalidOperationException($"Product with ID {productId} not found.");
                var marketItem = await _context.MarketplaceItems
                    .SingleOrDefaultAsync(m => m.Product_Id == productId)
                        ?? throw new InvalidOperationException($"Market item for product ID {productId} not found.");
                if ((marketItem.Quantity / 4) < quantity)
                    throw new InvalidOperationException("You can only buy up to a quarter of the available quantity in the market.");
                var inventoryItem = await _context.InventoryItems
                    .SingleOrDefaultAsync(i => i.User_Id == userId && i.Product_Id == productId);

                if (inventoryItem == null)
                {
                    inventoryItem = new InventoryItem
                    {
                        User_Id = userId,
                        Product_Id = productId,
                        Quantity = 0
                    };

                    await _context.InventoryItems.AddAsync(inventoryItem);
                }
                var totalPrice = quantity * product.Purchase_Price_Per_Unit;
                
                if (user.Credits < totalPrice)
                    throw new InvalidOperationException("User does not have enough credits to complete the purchase.");
                    
                inventoryItem.Quantity += quantity;
                marketItem.Quantity -= quantity;
                user.Credits -= totalPrice;
                product.Current_Quantity = (int)marketItem.Quantity;

                var transaction = new Transaction
                {
                    User_Id = userId,
                    Product_Id = productId,
                    Quantity = quantity,
                    TotalPrice = totalPrice,
                    TransactionType = Models.Enums.Transaction_Type.Buy,
                    Timestamp = DateTime.UtcNow
                };
                await _context.Transactions.AddAsync(transaction);
                await _context.SaveChangesAsync();
        }

        public async Task SellToMarketAsync(TradeRequestDto request)
        {
            var userId = request.User_Id;
            var quantity = request.Quantity;
            var productId = request.ProductId;
            if (quantity <= 0)
                throw new ArgumentException("Quantity must be greater than zero.", nameof(quantity));

                var user = await _context.Users.FindAsync(userId)
                        ?? throw new InvalidOperationException($"User with ID {userId} not found.");
                var product = await _context.Products.FindAsync(productId)
                        ?? throw new InvalidOperationException($"Product with ID {productId} not found.");
                var marketItem = await _context.MarketplaceItems
                    .SingleOrDefaultAsync(m => m.Product_Id == productId)
                        ?? throw new InvalidOperationException($"Market item for product ID {productId} not found.");
                 if ((marketItem.Quantity * 2) < quantity)
                    throw new InvalidOperationException("You can only sell up to double the available quantity in the market.");
                var inventoryItem = await _context.InventoryItems
                    .SingleOrDefaultAsync(i => i.User_Id == userId && i.Product_Id == productId);

                if (inventoryItem == null)
                {
                    inventoryItem = new InventoryItem
                    {
                        User_Id = userId,
                        Product_Id = productId,
                        Quantity = 0
                    };

                    await _context.InventoryItems.AddAsync(inventoryItem);
                }
                var totalPrice = quantity * product.Sale_Price_Per_Unit;
                
                if (inventoryItem.Quantity < quantity)
                    throw new InvalidOperationException("User does not have enough quantity in inventory to complete the sale.");
                    
                inventoryItem.Quantity -= quantity;
                marketItem.Quantity += quantity;
                user.Credits += totalPrice;
                product.Current_Quantity = (int)marketItem.Quantity;

                var transaction = new Transaction
                {
                    User_Id = userId,
                    Product_Id = productId,
                    Quantity = quantity,
                    TotalPrice = totalPrice,
                    TransactionType = Models.Enums.Transaction_Type.Sell,
                    Timestamp = DateTime.UtcNow
                };
                await _context.Transactions.AddAsync(transaction);
                await _context.SaveChangesAsync();
        }
    }
}