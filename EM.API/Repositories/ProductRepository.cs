using EM.API.Models;
using EM.API.Repositories;
using EM.API.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

public class ProductRepository : Repository<Product>, IProductRepository
{
    public ProductRepository(MarketplaceDbContext context) : base(context) { }
}