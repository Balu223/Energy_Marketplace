using EM.API.Services.DTOs;
using EM.API.Services.Interfaces;
using Stripe;

public class PaymentService : IPaymentService
{
    private const int CreditPriceInHuf = 100; // 1 kredit = 100 HUF (te döntöd el)

    public async Task<BuyCreditsResponse> CreatePaymentIntentAsync(int userId, int credits)
    {
        var amount = credits * CreditPriceInHuf; // Stripe HUF-nál egész számot vár

        var options = new PaymentIntentCreateOptions
        {
            Amount = amount,
            Currency = "huf",
            PaymentMethodTypes = new List<string> { "card" },
            Metadata = new Dictionary<string, string>
            {
                { "user_id", userId.ToString() },
                { "credits", credits.ToString() }
            }
        };

        var service = new PaymentIntentService();
        var paymentIntent = await service.CreateAsync(options);

        return new BuyCreditsResponse
        {
            ClientSecret = paymentIntent.ClientSecret,
            Amount = (int)amount,
            Currency = "huf"
        };
    }
}