using System.Collections.Generic;
using System.Threading.Tasks;
using EM.API.Models;
using EM.API.Services.DTOs;

namespace EM.API.Services.Interfaces
{
    public interface IUserService
    {
        Task<UserResponseDto?> GetUserByAuth0IdAsync(string auth0Id);
        Task<IEnumerable<UserResponseDto>> GetAllUsersAsync();
        Task<CreateUserDto> CreateUserAsync(CreateUserDto userDto);
        Task<UserResponseDto?> UpdateUserAsync(int userId, UpdateProfileDto userDto);
        Task<bool> DeleteUserAsync(int userId);
        Task<bool> DeactivateAsync(int userId);
        Task<bool> ActivateAsync(int userId);
        Task<UserResponseDto?> LoginUserAsync(LoginRequestDto loginRequest);
        Task<UserProfileDto> GetCurrentProfileAsync();
        Task<UserProfileDto> UpdateCurrentProfileAsync(UpdateProfileDto dto);

    }
}