using System.Security.Claims;
using EM.API.Models;
using EM.API.Models.Enums;
using EM.API.Repositories.Interfaces;
using EM.API.Services.Interfaces;

public class CurrentUserService : ICurrentUserService
{
    private readonly IUserRepository _userRepository;
    private readonly IHttpContextAccessor _httpContextAccessor;

    public CurrentUserService(IUserRepository userRepository, IHttpContextAccessor httpContextAccessor)
    {
        _userRepository = userRepository;
        _httpContextAccessor = httpContextAccessor;
    }

    public async Task<User> GetCurrentUserAsync()
    {
        var httpContext = _httpContextAccessor.HttpContext!;

        var principal = httpContext.User;
        var sub = principal.FindFirst("sub")?.Value
                        ?? principal.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        if (string.IsNullOrEmpty(sub))
            throw new InvalidOperationException("No Auth0 user id (sub) in token.");


        var user = await _userRepository.GetUserByAuth0IdAsync(sub);

        if (user is not null)
            return user;

        var email = principal.FindFirst(ClaimTypes.Email)?.Value
                    ?? principal.FindFirst("email")?.Value
                    ?? principal.FindFirst("http://localhost:4200/email")?.Value;

        var username =
            principal.FindFirst("http://localhost:4200/username")?.Value
            ?? principal.FindFirst("name")?.Value
            ?? principal.FindFirst("nickname")?.Value
            ?? email
            ?? sub;

        var allRoleClaims = principal.Claims
        .Where(c =>
            c.Type == ClaimTypes.Role ||
            c.Type == "roles" ||
            c.Type == "http://localhost:4200/roles")
        .ToList();
        var role = allRoleClaims.Select(c => c.Value).FirstOrDefault() ?? "User";

        user = new User
        {
            Auth0_Id = sub,
            Email = email ?? string.Empty,
            Address = string.Empty,
            Username = username ?? string.Empty,
            Role = role
        };

        await _userRepository.AddAsync(user);
        var saved = await _userRepository.SaveChangesAsync();
        Console.WriteLine($"New user saved. SaveChanges result = {saved}, New Id = {user.User_Id}");

        return user;
    }
}