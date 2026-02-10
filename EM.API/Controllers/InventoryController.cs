using EM.API.Services.DTOs;
using EM.API.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EM.API.Controllers
{
    [Controller]
    [Route("api/[controller]")]
    public class InventoryController : ControllerBase
    {
        private readonly IInventoryService _inventoryService;

        public InventoryController(IInventoryService inventoryService)
        {
            _inventoryService = inventoryService;
        }

        [HttpGet]
        [Authorize]
        [ProducesResponseType(typeof(IEnumerable<InventorySummaryDto>), StatusCodes.Status200OK)]
        public async Task<ActionResult<IEnumerable<InventorySummaryDto>>> GetInventory()
        {
            var result = await _inventoryService.GetInventoryAsync();
            return Ok(result);
        }
        [HttpGet("generate-missing")]
        [Authorize]
        [ProducesResponseType(typeof(IEnumerable<InventorySummaryDto>), StatusCodes.Status200OK)]
        public async Task<ActionResult<IEnumerable<InventorySummaryDto>>> GenerateMissingInventoryItems()
        {
            var result = await _inventoryService.GenerateMissingInventoryItemsAsync();
            return Ok(result);
        }
    }
}