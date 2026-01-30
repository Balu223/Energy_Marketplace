using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EM.API.Models
{
    public class InventoryItem
    {

        public InventoryItem()
        {
            CreatedAt = DateTime.UtcNow;
        }

        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int InventoryItem_Id { get; set; }  

        [Required]
        public int User_Id { get; set; }

        [ForeignKey(nameof(User_Id))]
        public User User { get; set; } = null!;

        [Required]
        public int Product_Id { get; set; }

        [ForeignKey(nameof(Product_Id))]
        public Product Product { get; set; } = null!;

        [Column(TypeName = "decimal(15,4)")]
        public decimal Quantity { get; set; }

        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }
}
