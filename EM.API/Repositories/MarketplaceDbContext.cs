using Microsoft.EntityFrameworkCore;
using EM.API.Models;

namespace EM.API.Repositories
{
    public class MarketplaceDbContext : DbContext
    {
        public MarketplaceDbContext(DbContextOptions<MarketplaceDbContext> options) : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Product> Products { get; set; }
        public DbSet<StripePayment> StripePayments { get; set; }
        public DbSet<InventoryItem> InventoryItems { get; set; }
        public DbSet<MarketplaceItem> MarketplaceItems { get; set; }
        public DbSet<Transaction> Transactions { get; set; }


        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            
            modelBuilder.Entity<User>(entity =>
            {
                entity.HasKey(e => e.User_Id);

            });

            modelBuilder.Entity<InventoryItem>(entity =>
            {
               entity.HasOne(ii => ii.User)
                     .WithMany(u => u.InventoryItems)
                     .HasForeignKey(ii => ii.User_Id);
            });

            modelBuilder.Entity<MarketplaceItem>(entity =>
            {
               entity.HasOne(mi => mi.Product)
                     .WithMany()
                     .HasForeignKey(mi => mi.Product_Id);
            });

            modelBuilder.Entity<Transaction>(entity =>
            {
               entity.HasOne(t => t.User)
                     .WithMany(u => u.Transactions)
                     .HasForeignKey(t => t.User_Id);
            });

            modelBuilder.Entity<StripePayment>(entity =>
            {
               entity.HasOne(sp => sp.User)
                     .WithMany(u => u.Stripe_payments)
                     .HasForeignKey(sp => sp.User_Id);
            });
        }
    }
}