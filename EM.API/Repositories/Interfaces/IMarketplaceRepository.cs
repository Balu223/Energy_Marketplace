using EM.API.Models;
using EM.API.Repositories.Interfaces;
namespace EM.API.Repositories.Interfaces
{
public interface IMarketplaceRepository : IRepository<MarketplaceItem>
{
   Task<IReadOnlyList<MarketplaceItem>> GetSummaryAsync();
   Task<MarketplaceItem?> GetByProductIdWithProductAsync(int productId);
 } 
}