using EM.API.Models;
using EM.API.Repositories.Interfaces;
namespace EM.API.Repositories.Interfaces
{
public interface IInventoryRepository : IRepository<InventoryItem>
{
   Task<IReadOnlyList<InventoryItem>> GetInventoryAsync(int userId);
   Task<IReadOnlyList<InventoryItem>> GenerateMissingInventoryItems(int userId);
 } 
}