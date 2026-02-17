using System.Runtime.CompilerServices;
using EM.API.Repositories;
using EM.API.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace EM.API.Repositories
{   
public class Repository<T> : IRepository<T> where T : class
{
    protected readonly MarketplaceDbContext _context;
    protected readonly DbSet<T> _dbSet;

    public Repository(MarketplaceDbContext context)
    {
        _context = context;
        _dbSet = _context.Set<T>();
    }

    public virtual async Task<T?> GetByIdAsync(int id)
        => await _dbSet.FindAsync(id);

    public virtual async Task<IEnumerable<T>> GetAllAsync()
        => await _dbSet.ToListAsync();

    public virtual async Task AddAsync(T entity)
    {
     await _dbSet.AddAsync(entity);
        await _context.SaveChangesAsync();
    }
    public virtual async Task UpdateAsync(T entity)
        { _dbSet.Update(entity);
            await _context.SaveChangesAsync();
        }

        

    public virtual async Task DeleteAsync(T entity)
        => _dbSet.Remove(entity);

    public Task<int> SaveChangesAsync()
        => _context.SaveChangesAsync();
}
}