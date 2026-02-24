using EM.API.Services.DTOs;
using EM.API.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EM.API.Controllers
{
    [ApiController]
    [Authorize(Roles = "User,Broker,Admin")]
    [Route("api/[controller]")]

    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly ICurrentUserService _currentUserService;

        public UserController(IUserService userService, ICurrentUserService currentUserService)
        {
            _userService = userService;
            _currentUserService = currentUserService;
        }
        
        [HttpPatch("deactivate")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeactivateUser(int userId)
        {
            var success = await _userService.DeactivateAsync(userId);
            if (!success)
            {
                return NotFound();
            }
            return NoContent();
        }

        [HttpGet("me")]
        [Authorize(Roles = "User,Broker,Admin")]
        public async Task<IActionResult> Me()
        {
            var user = await _currentUserService.GetCurrentUserAsync();
            if (user is null || !user.IsActive)
                return Forbid();
            var dto = new UserResponseDto
            {
                User_Id = user.User_Id,
                Username = user.Username,
                Email = user.Email,
                Address = user.Address,
                Role = user.Role,
                Credits = user.Credits

            };
            return Ok(dto);
        }
        [HttpPut("me")]
        [Authorize(Roles = "User,Broker,Admin")]
        public async Task<ActionResult<UserResponseDto>> UpdateMe(
            [FromBody] UpdateProfileDto userDto,
            [FromServices] ICurrentUserService currentUserService,
            [FromServices] IUserService userService)
        {
            var user = await currentUserService.GetCurrentUserAsync();
            var result = await userService.UpdateUserAsync(user.User_Id, userDto);
            if (result == null)
            {
                return NotFound();
            }
            return Ok(result);
        }
    }
}