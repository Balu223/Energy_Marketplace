using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Transactions;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using EM.API.Models.Enums;

namespace EM.API.Models
{
    public class User
    {
        public User()
        {
            Stripe_payments = new HashSet<StripePayment>();
            Transactions = new HashSet<Transaction>();
            InventoryItems = new HashSet<InventoryItem>();
            CreatedAt = DateTime.UtcNow;
        }

        [Key]                       
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int User_Id { get; set; }
        [Required]
        public string Auth0_Id { get; set; } = null!;

        [Required]
        public string Username { get; set; } = null!;

        [Required]
        public string Email { get; set; } = null!;
        public string Role { get; set; } = "User";

        public string Address { get; set; } = string.Empty;

        public decimal Credits { get; set; } = 100;

        public DateTime CreatedAt { get; set; }

        public DateTime? UpdatedAt { get; set; }

        public bool IsActive { get; set; } = true;

        public virtual ICollection<StripePayment> Stripe_payments { get; set; }
        public virtual ICollection<Transaction> Transactions { get; set; }
        public virtual ICollection<InventoryItem> InventoryItems { get; set; }
    }
}
