using EM.API.Models;
using EM.API.Models.Enums;
using EM.API.Repositories.Interfaces;
using EM.API.Services.DTOs;
using EM.API.Services.Interfaces;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Microsoft.OpenApi;

namespace EM.API.Services
{
public class InventoryService : IInventoryService
{
    private readonly IInventoryRepository _inventoryRepository;

    public InventoryService(IInventoryRepository inventoryRepository)
    {
        _inventoryRepository = inventoryRepository;
    }

        public async Task<IEnumerable<InventorySummaryDto>> GenerateMissingInventoryItemsAsync()
        {
            var items = await _inventoryRepository.GenerateMissingInventoryItems();
            return items.Select(m => new InventorySummaryDto
            {
                Product_Id = m.Product_Id,
                Quantity = m.Quantity,
                Product_Name = m.Product.Product_Name,
                Purchase_Price_Per_Unit = m.Product.Purchase_Price_Per_Unit,
                Sale_Price_Per_Unit = m.Product.Sale_Price_Per_Unit,
                Unit = m.Product.Unit.ToString()
            });
        }

        public async Task<IEnumerable<InventorySummaryDto>> GetInventoryAsync()
    {
        var items = await _inventoryRepository.GetInventoryAsync();
        
        return items.Select(m => new InventorySummaryDto
        {
            Product_Id = m.Product_Id,
            Quantity = m.Quantity,
            Product_Name = m.Product.Product_Name,
            Purchase_Price_Per_Unit = m.Product.Purchase_Price_Per_Unit,
            Sale_Price_Per_Unit = m.Product.Sale_Price_Per_Unit,
            Unit = m.Product.Unit.ToString()

        }).ToList();
    }
    }
}