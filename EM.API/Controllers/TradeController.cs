using EM.API.Models;
using EM.API.Repositories.Interfaces;
using EM.API.Services.DTOs;
using EM.API.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace EM.API.Controllers
{


    [Controller]
    [Route("api/[controller]")]
    public class TradeController : ControllerBase
    {
        private readonly ICurrentUserService _currentUserService;
        private readonly ITradingService _tradingService;

        public TradeController(ICurrentUserService currentUserService, ITradingService tradingService)
        {
            _currentUserService = currentUserService;
            _tradingService = tradingService;
        }


        [HttpPost("buy")]
        public async Task<IActionResult> BuyFromMarket([FromBody] TradeRequestDto request)
        {
            var currentUser = await _currentUserService.GetCurrentUserAsync();
            if (currentUser == null)
            {
                return Unauthorized();
            }

            try
            {
                var updatedRequest = new TradeRequestDto
                {
                    User_Id = currentUser.User_Id,
                    ProductId = request.ProductId,
                    Quantity = request.Quantity
                };
                await _tradingService.BuyFromMarketAsync(updatedRequest);
                return Ok(new { Message = "Purchase successful" });
            }
            catch (Exception ex)
            {
                // Log the exception (not implemented here)
                return BadRequest(new { Message = ex.Message });
            }
        }
        [HttpPost("sell")]
        public async Task<IActionResult> SellToMarket([FromBody] TradeRequestDto request)
        {
            var currentUser = await _currentUserService.GetCurrentUserAsync();
            if (currentUser == null)
            {
                return Unauthorized();
            }

            try
            {
                var updatedRequest = new TradeRequestDto
                {
                    User_Id = currentUser.User_Id,
                    ProductId = request.ProductId,
                    Quantity = request.Quantity
                };
                await _tradingService.SellToMarketAsync(updatedRequest);
                return Ok(new { Message = "Sale successful" });
            }
            catch (Exception ex)
            {
                // Log the exception (not implemented here)
                return BadRequest(new { Message = ex.Message });
            }
        }

        
    }
}