using EM.API.Services.DTOs;
using EM.API.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EM.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly ICurrentUserService _currentUserService;

        public UserController(IUserService userService, ICurrentUserService currentUserService)
        {
            _userService = userService;
            _currentUserService = currentUserService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<UserResponseDto>>> GetAllUsers()
        {
            var result = await _userService.GetAllUsersAsync();
            return Ok(result);
        }
        [HttpGet("{userId}")]
        public async Task<ActionResult<UserResponseDto>> GetUserById(int userId)
        {
            var result = await _userService.GetUserByIdAsync(userId);
            if (result == null)
            {
                return NotFound();
            }
            return Ok(result);
        }
        [HttpPost]
        public async Task<ActionResult<UserResponseDto>> CreateUser([FromBody] CreateUserDto userDto)
        {
            var result = await _userService.CreateUserAsync(userDto);
            if (result == null)
            {
                return BadRequest("User could not be created.");
            }
            return CreatedAtAction(nameof(GetUserById), new { userId = result.User_Id }, result);
        }

        [HttpPut("{userId:int}")]
        public async Task<ActionResult<UserResponseDto>> UpdateUser(int userId, [FromBody] UpdateProfileDto userDto)
        {
            var result = await _userService.UpdateUserAsync(userId, userDto);
            if (result == null)
            {
                return NotFound();
            }
            return Ok(result);
        }
        [HttpDelete("{userId}")]
        public async Task<IActionResult> DeleteUser(int userId)
        {
            var success = await _userService.DeleteUserAsync(userId);
            if (!success)
            {
                return NotFound();
            }
            return NoContent();
        }
        [HttpPost("login")]
        public async Task<ActionResult<UserResponseDto>> LoginUser([FromBody] LoginRequestDto loginRequest)
        {
            var result = await _userService.LoginUserAsync(loginRequest);
            if (result == null)
            {
                return Unauthorized("Invalid username or password.");
            }
            return Ok(result);
        }
        [HttpPost("deactivate/{userId}")]
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
        public async Task<IActionResult> Me()
        {
            var user = await _currentUserService.GetCurrentUserAsync();
            var dto = new UserResponseDto{
                User_Id = user.User_Id,
                Username = user.Username,
                Email = user.Email,
                Address = user.Address,
                Role = user.Role
                
            };
            return Ok(dto);
        }
        [HttpPut("me")]
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