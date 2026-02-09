using System.Transactions;
using EM.API.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace EM.API.Repositories
{
    public class TransactionRepository : Repository<Transaction>, IRepository<Transaction>
    {

        public TransactionRepository(MarketplaceDbContext context) : base(context) { }
        

        public async Task<IReadOnlyList<Transaction>> GetByUserAsync(int userId)
        {
        return (IReadOnlyList<Transaction>)await _context.Transactions
            .AsNoTracking()
            .Where(t => t.User_Id == userId)
            .OrderByDescending(t => t.Timestamp)
            .ToListAsync();
        }
    }    
}
