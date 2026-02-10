using EM.API.Models;
using EM.API.Repositories;
using EM.API.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

public class ProductRepository : Repository<Product>, IProductRepository
{
    public ProductRepository(MarketplaceDbContext context) : base(context) { }

    public async Task<IReadOnlyList<Product>> GetProductsAsync()
    {
        return await _context.Products.ToListAsync();
    }
}