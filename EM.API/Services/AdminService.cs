using EM.API.Models;
using EM.API.Models.Enums;
using EM.API.Repositories.Interfaces;
using EM.API.Services.DTOs;
using EM.API.Services.Interfaces;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Microsoft.OpenApi;

namespace EM.API.Services
{
public class AdminService : IAdminService
{
    private readonly IUserRepository _userRepository;

    public AdminService(IUserRepository userRepository)
    {
        _userRepository = userRepository;
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
                Credits = u.Credits,
                IsActive = u.IsActive
            }).ToList();
        }
    }
}