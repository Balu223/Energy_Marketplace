using EM.API.Models.Enums;

namespace EM.API.Services.DTOs
{
    public class UpdateProfileDto
    {
        public int User_Id { get; set; }
        public string Username { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
        public string Role { get; set; } = string.Empty;
        public DateTime? UpdatedAt { get; set; } = DateTime.UtcNow;
        public decimal Credits { get; set; } = 100;
    }
}