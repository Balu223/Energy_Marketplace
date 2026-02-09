using EM.API.Models;

namespace EM.API.Repositories.Interfaces
{
    public interface IUserRepository : IRepository<User>
    {
        Task<User?> GetUserByAuth0IdAsync(string auth0Id);
        Task<bool> DeactivateAsync(int userId);
        Task<User?> LoginUserAsync(string username, string password);

    }
}