namespace EM.API.Services.Interfaces
{
    public interface ITradingService
    {
        Task BuyFromMarketAsync(TradeRequestDto request);
        Task SellToMarketAsync(TradeRequestDto request);

    }
}