using EM.API.Models;
using EM.API.Repositories;
using EM.API.Repositories.Interfaces;
using EM.API.Services.DTOs;
using EM.API.Services.Interfaces;

public class UserService : IUserService
{
    private readonly ICurrentUserService _currentUserService;
    private readonly IUserRepository _userRepository;

    public UserService(ICurrentUserService currentUserService, IUserRepository userRepository)
    {
        _currentUserService = currentUserService;
        _userRepository = userRepository;
    }
    public async Task<UserResponseDto?> CreateUserAsync(CreateUserDto userDto)
    {
      throw new NotImplementedException();
    }

    public async Task<bool> DeactivateAsync(int userId)
    {
        throw new NotImplementedException();
    }

    public async Task<bool> DeleteUserAsync(int userId)
    {
        throw new NotImplementedException();
    }

    public async Task<IEnumerable<UserResponseDto>> GetAllUsersAsync()
    {
        throw new NotImplementedException();
    }

    public async Task<UserProfileDto> GetCurrentProfileAsync()
    {
        var user = await _currentUserService.GetCurrentUserAsync();
        return new UserProfileDto
        {
            UserId = user.User_Id,
            Username = user.Username,
            Email = user.Email,
            Address = user.Address,
            Role = user.Role
        };
    }

    public async Task<UserResponseDto?> GetUserByAuth0IdAsync(string auth0Id)
    {
        throw new NotImplementedException();
    }

    public async Task<UserResponseDto?> GetUserByIdAsync(int userId)
    {
        throw new NotImplementedException();
    }

    public async Task<UserResponseDto?> LoginUserAsync(LoginRequestDto loginRequest)
    {
        throw new NotImplementedException();
    }

    public async Task<UserProfileDto> UpdateCurrentProfileAsync(UpdateProfileDto dto)
    {
        var user = await _currentUserService.GetCurrentUserAsync();
        return new UserProfileDto
        {
            UserId = user.User_Id,
            Username = user.Username,
            Email = user.Email,
            Address = user.Address,
            Role = user.Role
        };
    }

    public async Task<UserResponseDto?> UpdateUserAsync(int userId, UpdateProfileDto userDto)
    {
        var user = await _userRepository.GetUserById(userId);
        if (user == null)
        {
            return null;
        }
        else
        {
            user.Username = userDto.Username;
            user.Email = userDto.Email;
            user.Address = userDto.Address;
            user.Role = userDto.Role;
            user.UpdatedAt = userDto.UpdatedAt;

            var updatedUser = await _userRepository.UpdateUserAsync(userId, user);
            if (updatedUser == null)
            {
                return null;
            }
            return new UserResponseDto
            {
                User_Id = updatedUser.User_Id,
                Username = updatedUser.Username,
                Email = updatedUser.Email,
                Address = updatedUser.Address,
                Role = updatedUser.Role,
                UpdatedAt = updatedUser.UpdatedAt
            };
        }
    }
}