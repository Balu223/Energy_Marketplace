using EM.API.Models.Enums;

namespace EM.API.Services.DTOs
{
    public class CreateUserDto
    {
        public string Username { get; set; } = string.Empty;
        public string PasswordHash { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string address { get; set; } = string.Empty;
        public Roles Role { get; set; }
    }
}