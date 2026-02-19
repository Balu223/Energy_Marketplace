using EM.API.Models;
using EM.API.Repositories;
using EM.API.Repositories.Interfaces;
using Stripe;

public class PaymentRepository : Repository<StripePayment>, IPaymentRepository
{
    public PaymentRepository(MarketplaceDbContext context) : base(context) { }
}