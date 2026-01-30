using EM.API.Models;
using EM.API.Repositories;
using EM.API.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

public class MarketplaceRepository : Repository<MarketplaceItem>, IMarketplaceRepository
{
    public MarketplaceRepository(MarketplaceDbContext context) : base(context) { }

    public async Task<IReadOnlyList<MarketplaceItem>> GetSummaryAsync()
    {
        return await _context.MarketplaceItems
            .Include(m => m.Product)
            .ToListAsync();
    }
}