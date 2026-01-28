using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using EM.API.Models.Enums;

namespace EM.API.Models
{
    public class StripePayment
    {
        public StripePayment()
        {
            CreatedAt = DateTime.UtcNow;
            Currency = "HUF";
        }

        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Payment_Id { get; set; }

        [Required]
        public int User_Id { get; set; }

        [ForeignKey(nameof(User_Id))]
        public User User { get; set; } = null!;

        [Required]
        [MaxLength(255)]
        public string StripePaymentIntentId { get; set; } = null!;

        [Column(TypeName = "decimal(12,2)")]
        public decimal Amount { get; set; }

        [Required]
        [MaxLength(3)]
        public string Currency { get; set; } = "HUF";

        [Required]
        public PaymentStatus PaymentStatus { get; set; }

        public DateTime CreatedAt { get; set; }
    }
}