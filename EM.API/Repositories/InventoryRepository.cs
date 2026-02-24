using EM.API.Models;
using EM.API.Repositories;
using EM.API.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

public class InventoryRepository : Repository<InventoryItem>, IInventoryRepository
{
    public InventoryRepository(MarketplaceDbContext context) : base(context) { }

    public async Task<IReadOnlyList<InventoryItem>> GetInventoryAsync(int userId)
    {
        return await _context.InventoryItems
            .Where(i => i.User_Id == userId)
            .Include(m => m.Product)
            .ToListAsync();
    }
     public async Task<IReadOnlyList<InventoryItem>> GenerateMissingInventoryItems(int UserId)
    {
        var products = await _context.Products.ToListAsync();
        var existingInventoryItems = await _context.InventoryItems.Where(i => i.User_Id == UserId).Include(i => i.Product).ToListAsync();
        var existingByProdId = existingInventoryItems.ToDictionary(i => i.Product_Id);

        var result = new List<InventoryItem>();

        foreach (var product in products)
        {
            if (existingByProdId.TryGetValue(product.Product_Id, out var inventoryItem))
            {
                result.Add(inventoryItem);
            }
            else
            {
                var newItem = new InventoryItem
                {
                    Product_Id = product.Product_Id,
                    Product = product,
                    Quantity = 0
                };
                result.Add(newItem);
            }
        }
        return result;
    }
}