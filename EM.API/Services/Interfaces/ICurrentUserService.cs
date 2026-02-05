using EM.API.Models;

public interface ICurrentUserService
{
    Task<User> GetCurrentUserAsync();
}

