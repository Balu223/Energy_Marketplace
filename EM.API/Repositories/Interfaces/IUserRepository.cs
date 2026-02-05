using EM.API.Models;

namespace EM.API.Repositories.Interfaces
{
    public interface IUserRepository: IRepository<User>
    {
        Task<User?> GetUserById(int userId);
        Task<User?> GetUserByAuth0IdAsync(string auth0Id);
        Task<IReadOnlyList<User>> GetAllUsersAsync();
        Task<User?> CreateUserAsync(User user);
        Task<User?> UpdateUserAsync(int userId, User user);
        Task<bool> DeleteUserAsync(int userId);
        Task<bool> DeactivateAsync(int userId);
        Task<User?> LoginUserAsync(string username, string password);

    }
}