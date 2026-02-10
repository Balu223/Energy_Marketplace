using EM.API.Models;
using EM.API.Repositories.Interfaces;
namespace EM.API.Repositories.Interfaces
{
public interface IInventoryRepository : IRepository<InventoryItem>
{
   Task<IReadOnlyList<InventoryItem>> GetInventoryAsync();
   Task<IReadOnlyList<InventoryItem>> GenerateMissingInventoryItems();
 } 
}