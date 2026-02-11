using EM.API.Models.Enums;

namespace EM.API.Services.DTOs
{
    public class MarketplaceSummaryDto
    {
        public int Product_Id { get; set; }
        public decimal Quantity { get; set; }

        public string Product_Name { get; set; } = null!;
        public decimal Purchase_Price_Per_Unit { get; set; }
        public decimal Sale_Price_Per_Unit { get; set; }
        public string? Unit { get; set; } 

    }
}