using EM.API.Services.DTOs;
using EM.API.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace EM.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;

        public UserController(IUserService userService)
        {
            _userService = userService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<UserResponseDto>>> GetAllUsers()
        {
            var result = await _userService.GetAllUsersAsync();
            return Ok(result);
        }
        [HttpGet("{userId}")]
        public async Task<ActionResult<UserResponseDto>> GetUserById(string userId)
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

        [HttpPut("{userId}")]
        public async Task<ActionResult<UserResponseDto>> UpdateUser(string userId, [FromBody] UpdateUserDto userDto)
        {
            var result = await _userService.UpdateUserAsync(userId, userDto);
            if (result == null)
            {
                return NotFound();
            }
            return Ok(result);
        }
        [HttpDelete("{userId}")]
        public async Task<IActionResult> DeleteUser(string userId)
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
        public async Task<IActionResult> DeactivateUser(string userId)
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