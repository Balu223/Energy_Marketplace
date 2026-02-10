using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using EM.API.Models;
using EM.API.Services.DTOs;

namespace EM.API.Services.Interfaces
{
    public interface IInventoryService
    {
        Task<IEnumerable<InventorySummaryDto>> GetInventoryAsync();
        Task<IEnumerable<InventorySummaryDto>> GenerateMissingInventoryItemsAsync();
    }
}