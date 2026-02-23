namespace EM.API.Services.DTOs
{
public class BuyCreditsRequest
{
    public int Credits { get; set; } // pl. 100 kredit
}

public class BuyCreditsResponse
{
    public string ClientSecret { get; set; } = "";
    public int Amount { get; set; }
    public string Currency { get; set; } = "huf";
}
}