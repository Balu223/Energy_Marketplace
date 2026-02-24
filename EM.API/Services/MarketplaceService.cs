using EM.API.Models;
using EM.API.Models.Enums;
using EM.API.Repositories.Interfaces;
using EM.API.Services.DTOs;
using EM.API.Services.Interfaces;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Microsoft.OpenApi;

namespace EM.API.Services
{
public class MarketplaceService : IMarketplaceService
{
    private readonly IMarketplaceRepository _marketplaceRepository;

    public MarketplaceService(IMarketplaceRepository marketplaceRepository)
    {
        _marketplaceRepository = marketplaceRepository;
    }

    public async Task<IEnumerable<MarketplaceSummaryDto>> GetSummaryAsync()
    {
        var items = await _marketplaceRepository.GetSummaryAsync();
        
        return items.Select(m => new MarketplaceSummaryDto
        {
            Product_Id = m.Product_Id,
            Quantity = m.Quantity,
            Product_Name = m.Product.Product_Name,
            Purchase_Price_Per_Unit = m.Product.Purchase_Price_Per_Unit,
            Sale_Price_Per_Unit = m.Product.Sale_Price_Per_Unit,
            Unit = m.Product.Unit.ToString()

        }).ToList();
    }
        public async Task<MarketplaceSummaryDto> UpdatePrice(MarketplaceSummaryDto updatePriceDto)
    {
        
        var item = await _marketplaceRepository.GetByProductIdWithProductAsync(updatePriceDto.Product_Id);
        if (item == null)
        {
           throw new KeyNotFoundException($"Product with ID {updatePriceDto.Product_Id} not found.");
        }
        item.Product.Purchase_Price_Per_Unit = updatePriceDto.Purchase_Price_Per_Unit;
        item.Product.Sale_Price_Per_Unit = updatePriceDto.Sale_Price_Per_Unit;
    
        await _marketplaceRepository.UpdateAsync(item);

        return new MarketplaceSummaryDto
        {
            Product_Id = item.Product_Id,
            Quantity = item.Quantity,
            Product_Name = item.Product.Product_Name,
             Unit = item.Product.Unit.ToString(),
            Purchase_Price_Per_Unit = item.Product.Purchase_Price_Per_Unit,
            Sale_Price_Per_Unit = item.Product.Sale_Price_Per_Unit
        };
    }
}
}