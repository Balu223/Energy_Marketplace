using EM.API.Models;
using EM.API.Models.Enums;
using EM.API.Repositories;
using EM.API.Repositories.Interfaces;
using EM.API.Services.DTOs;
using EM.API.Services.Interfaces;
using Microsoft.AspNetCore.Http.HttpResults;

public class UserService : IUserService
{
    private readonly ICurrentUserService _currentUserService;
    private readonly IUserRepository _userRepository;
    private readonly IAuth0Service _auth0Service;

    public UserService(ICurrentUserService currentUserService, IUserRepository userRepository, IAuth0Service auth0Service)
    {
        _currentUserService = currentUserService;
        _userRepository = userRepository;
        _auth0Service = auth0Service;
    }
public async Task<CreateUserDto> CreateUserAsync(CreateUserDto userDto)
{
    // 1) Auth0 user létrehozása
    var auth0UserId = await _auth0Service.CreateAuth0UserAsync(userDto);

    // 2) Local user entitás
    var user = new User
    {
        Username = userDto.Username,
        Email = userDto.Email,
        Address = userDto.address,
        Role = userDto.Role ?? "User",
        Auth0_Id = auth0UserId
    };

    await _userRepository.AddAsync(user);   // ebben legyen SaveChangesAsync

    // 3) Visszatérő DTO (ha kell)
    return new CreateUserDto
    {
        Username = user.Username,
        Email = user.Email,
        address = user.Address,
        Role = user.Role,
    };
}

    public async Task<bool> DeactivateAsync(int userId)
    {
        var user = await _userRepository.GetByIdAsync(userId);
        if (user is null)
        {
            return false;
        }
        await _userRepository.DeactivateAsync(user.User_Id);
        if(!string.IsNullOrEmpty(user.Auth0_Id))
        {
            await _auth0Service.DeactivateAuth0UserAsync(user.Auth0_Id);
        }
        return true;
    }

    public async Task<bool> DeleteUserAsync(int userId)
    {
        var user = await _userRepository.GetByIdAsync(userId);
        if (user is null)
        {
            return false;
        }
        await _userRepository.DeleteAsync(user);
        if(!string.IsNullOrEmpty(user.Auth0_Id))
        {
            await _auth0Service.DeleteAuth0UserAsync(user.Auth0_Id);
        }
        return true;
    }

    public async Task<IEnumerable<UserResponseDto>> GetAllUsersAsync()
    {
        var users = await _userRepository.GetAllAsync();
        return users.Select(u => new UserResponseDto
        {
            User_Id = u.User_Id,
            Username = u.Username,
            Email = u.Email,
            Role = u.Role.ToString(),
            Credits = u.Credits
        }).ToList();
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
            Role = user.Role,
        };
    }

    public async Task<UserResponseDto?> GetUserByAuth0IdAsync(string auth0Id)
    {
        throw new NotImplementedException();
    }

   /* public async Task<UserResponseDto?> GetUserByIdAsync(int userId)
    {
        throw new NotImplementedException();
    }
*/
    public async Task<UserResponseDto?> LoginUserAsync(LoginRequestDto loginRequest)
    {
        throw new NotImplementedException();
    }

    public async Task<UserProfileDto> UpdateCurrentProfileAsync(UpdateProfileDto dto)
    {
        var user = await _currentUserService.GetCurrentUserAsync();

        if(!string.IsNullOrEmpty(user.Auth0_Id))
        {
            await _auth0Service.UpdateAuth0UserAsync(
                user.Auth0_Id,
                user.Email,
                user.Username,
                user.Role
            );
        }
                return new UserProfileDto
        {
            UserId = user.User_Id,
            Username = user.Username,
            Email = user.Email,
            Address = user.Address,
            Role = user.Role,
            Credits = user.Credits
        };
    }

public async Task<UserResponseDto?> UpdateUserAsync(int userId, UpdateProfileDto userDto)
{
    var user = await _userRepository.GetByIdAsync(userId);
    if (user == null)
    {
        return null;
    }

    user.Username = userDto.Username;
    user.Email = userDto.Email;
    user.Address = userDto.Address;
    user.Role = userDto.Role;
    user.UpdatedAt = userDto.UpdatedAt;
    user.Credits = userDto.Credits;

    await _userRepository.UpdateAsync(user);

    if(!string.IsNullOrEmpty(user.Auth0_Id))
        {
            await _auth0Service.UpdateAuth0UserAsync(
                user.Auth0_Id,
                user.Email,
                user.Username,
                user.Role
            );
        }
    return new UserResponseDto
    {
        User_Id = user.User_Id,
        Username = user.Username,
        Email = user.Email,
        Address = user.Address,
        Role = user.Role,
        UpdatedAt = user.UpdatedAt,
        Credits = user.Credits
    };
}

}