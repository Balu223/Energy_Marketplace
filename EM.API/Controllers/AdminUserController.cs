namespace EM.API.Controllers
{
    using EM.API.Models;
    using EM.API.Repositories.Interfaces;
    using EM.API.Services;
    using EM.API.Services.DTOs;
    using EM.API.Services.Interfaces;
    using Microsoft.AspNetCore.Mvc;

    [ApiController]
    [Route("api/admin/")] //lehet hogy nem kell a / ide ha elbasztam akkor majd javítom, csak emlékezzek erre
    public class AdminUserController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly IMarketplaceService _marketplaceService;

        public AdminUserController(IUserService userService, IMarketplaceService marketplaceService)
        {
            _userService = userService;
            _marketplaceService = marketplaceService;
        }

        [HttpGet("users")]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<UserResponseDto>>> GetAllUsers()
        {
            var result = await _userService.GetAllUsersAsync();
            return Ok(result);
        }

        [HttpPut("update-price")]
        public async Task<ActionResult<MarketplaceSummaryDto>> UpdatePrice([FromBody] MarketplaceSummaryDto priceDto)
        {
            var updatedPrice = await _marketplaceService.UpdatePrice(priceDto);
            return Ok(updatedPrice);
        }
        [HttpPut("update-profile")]
        public async Task<ActionResult<UpdateProfileDto>> UpdateProfile([FromBody] UpdateProfileDto userDto)
        {
            int userId = userDto.User_Id;
            var updatedPrice = await _userService.UpdateUserAsync(userId, userDto);
            return Ok(updatedPrice);
        }
        [HttpPut("create-profile")]
        public async Task<ActionResult> CreateProfile([FromBody] CreateUserDto dto)
        {
            var profile = await _userService.CreateUserAsync(dto);
            return NoContent();
        }
        [HttpDelete("delete/{id}")]
        public async Task<ActionResult> DeleteProfile( int id)
        {
            await _userService.DeleteUserAsync(id);
            return Ok();
        }
        [HttpPatch("deactivate/{userId}")]
        public async Task<IActionResult> DeactivateUser(int userId)
        {
            var success = await _userService.DeactivateAsync(userId);
            if (!success)
            {
                return NotFound();
            }
            return NoContent();
        }
    }
}