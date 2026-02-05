using EM.API.Models.Enums;

namespace EM.API.Services.DTOs
{
    public class UserResponseDto
    {
        public int? User_Id { get; set; }
        public string? Username { get; set; } = string.Empty;
        public string? Email { get; set; } = string.Empty;
        public string? Address { get; set; } = string.Empty;
        public string? Role { get; set; }
        public DateTime? UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}