using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EM.API.Models
{
    public class MarketplaceItem
    {
        public MarketplaceItem()
        {        }
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int MarketplaceItem_Id { get; set; }

        [Required]
        public int Product_Id { get; set; }

        [ForeignKey(nameof(Product_Id))]
        public Product Product { get; set; } = null!;

        [Column(TypeName = "decimal(15,4)")]
        public decimal Quantity { get; set; }

        public DateTime UpdatedAt { get; set; }
    }
}
