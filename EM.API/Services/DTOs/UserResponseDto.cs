using EM.API.Models.Enums;

namespace EM.API.Services.DTOs
{
    public class UserResponseDto
    {
        public string? User_Id { get; set; } = string.Empty;
        public string? Username { get; set; } = string.Empty;
        public string? PasswordHash { get; set; } = string.Empty;
        public string? Email { get; set; } = string.Empty;
        public string? Address { get; set; } = string.Empty;
        public Roles? Role { get; set; }
    }
}