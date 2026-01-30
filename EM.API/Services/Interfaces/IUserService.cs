using System.Collections.Generic;
using System.Threading.Tasks;
using EM.API.Services.DTOs;

namespace EM.API.Services.Interfaces
{
    public interface IUserService
    {
        Task<UserResponseDto?> GetUserByIdAsync(string userId);
        Task<IEnumerable<UserResponseDto>> GetAllUsersAsync();
        Task<UserResponseDto?> CreateUserAsync(CreateUserDto userDto);
        Task<UserResponseDto?> UpdateUserAsync(string userId, UpdateUserDto userDto);
        Task<bool> DeleteUserAsync(string userId);
        Task<bool> DeactivateAsync(string userId);
        Task<UserResponseDto?> LoginUserAsync(LoginRequestDto loginRequest);

    }
}