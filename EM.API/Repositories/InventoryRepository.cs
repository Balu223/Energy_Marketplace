using EM.API.Models;

namespace EM.API.Repositories
{
    public class InventoryRepository : Repository<InventoryItem> //, IInventoryRepository
    {
        public InventoryRepository(MarketplaceDbContext context) : base(context)
        {
 
        }
    }
}