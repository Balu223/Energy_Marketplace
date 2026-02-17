using EM.API.Models;

namespace EM.API.Services.Interfaces
{
public interface ICurrentUserService
{
    Task<User> GetCurrentUserAsync();
}
}

