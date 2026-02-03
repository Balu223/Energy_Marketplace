using System.Collections.Generic;
using System.Threading.Tasks;
using EM.API.Services.DTOs;

namespace EM.API.Services.Interfaces
{
    public interface IUserService
    {
        Task<UserResponseDto?> GetUserByIdAsync(int userId);
        Task<IEnumerable<UserResponseDto>> GetAllUsersAsync();
        Task<UserResponseDto?> CreateUserAsync(CreateUserDto userDto);
        Task<UserResponseDto?> UpdateUserAsync(int userId, UpdateUserDto userDto);
        Task<bool> DeleteUserAsync(int userId);
        Task<bool> DeactivateAsync(int userId);
        Task<UserResponseDto?> LoginUserAsync(LoginRequestDto loginRequest);

    }
}