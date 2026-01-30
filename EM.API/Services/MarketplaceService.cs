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
            Price_Per_Unit = m.Product.Price_Per_Unit,
            Unit = m.Product.Unit.ToString()

        }).ToList();
    }
    }
}