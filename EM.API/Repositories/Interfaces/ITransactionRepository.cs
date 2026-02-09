using EM.API.Models;

namespace EM.API.Repositories.Interfaces
{
    public interface ITransactionRepository : IRepository<Transaction>
    {

        Task<IReadOnlyList<Transaction>> GetByUserAsync(int userId);

    }
}