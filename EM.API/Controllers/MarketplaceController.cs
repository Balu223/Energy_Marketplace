using EM.API.Services.DTOs;
using EM.API.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EM.API.Controllers
{
    [ApiController]
    [Authorize(Roles = "User,Broker,Admin")]
    [Route("api/[controller]")]
    public class MarketplaceController : ControllerBase
    {
        private readonly IMarketplaceService _marketplaceService;

        public MarketplaceController(IMarketplaceService marketplaceService)
        {
            _marketplaceService = marketplaceService;
        }

        [HttpGet("summary")]
        [Authorize(Roles = "User,Broker,Admin")]
        [ProducesResponseType(typeof(IEnumerable<MarketplaceSummaryDto>), StatusCodes.Status200OK)]
        public async Task<ActionResult<IEnumerable<MarketplaceSummaryDto>>> GetSummary()
        {
            var result = await _marketplaceService.GetSummaryAsync();
            return Ok(result);
        }
    }
}