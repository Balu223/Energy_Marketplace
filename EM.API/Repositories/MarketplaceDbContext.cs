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
        public DbSet<Product> Products { get; set; } = null!;
        public DbSet<StripePayment> StripePayments { get; set; }
        public DbSet<InventoryItem> InventoryItems { get; set; }
        public DbSet<MarketplaceItem> MarketplaceItems { get; set; } = null!;
        public DbSet<Transaction> Transactions { get; set; }


        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            
            modelBuilder.Entity<User>(entity =>
            {
                entity.HasIndex(u => u.Auth0_Id).IsUnique();

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
            modelBuilder.Entity<Product>()
            .Property(p => p.Unit)
            .HasConversion(
                v => v.ToString(),
                v => (Models.Enums.Units)Enum.Parse(typeof(Models.Enums.Units), v));
            

        modelBuilder.Entity<Product>().HasData(
        new Product { 
            Product_Id = 1,
            Product_Name = "Electricity", 
            Price_Per_Unit = 150.00m, 
            Initial_Quantity = 1000, 
            Current_Quantity = 1000, 
            Unit = Models.Enums.Units.kWh },

        new Product { 
            Product_Id = 2, 
            Product_Name = "Natural Gas", 
            Price_Per_Unit = 45.00m, 
            Initial_Quantity = 500, 
            Current_Quantity = 500, 
            Unit = Models.Enums.Units.m3 },

        new Product { 
            Product_Id = 3, 
            Product_Name = "Crude Oil", 
            Price_Per_Unit = 280.00m, 
            Initial_Quantity = 200, 
            Current_Quantity = 200, 
            Unit = Models.Enums.Units.liters }
        );

        modelBuilder.Entity<MarketplaceItem>().HasData(

        new MarketplaceItem
        {
            MarketplaceItem_Id = 1,
            Product_Id = 1,                // Electricity
            Quantity = 10000.0000m
        },
        new MarketplaceItem
        {
            MarketplaceItem_Id = 2,
            Product_Id = 2,                // Natural Gas
            Quantity = 5000.0000m
        },
        new MarketplaceItem
        {
            MarketplaceItem_Id = 3,
            Product_Id = 3,                // Crude Oil
            Quantity = 1000.0000m
        }
        );

        }
    }
}