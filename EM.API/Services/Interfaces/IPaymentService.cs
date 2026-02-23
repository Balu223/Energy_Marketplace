using EM.API.Services.DTOs;

namespace EM.API.Services.Interfaces
{
    public interface IPaymentService
    {
        Task<BuyCreditsResponse> CreatePaymentIntentAsync(int userId, int credits);
    }
}