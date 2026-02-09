using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Transactions;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using EM.API.Models.Enums;


namespace EM.API.Models
{

    public class Transaction
    {

        public Transaction()
        {
           // Products = new HashSet<Product>();
        }

        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Transaction_Id { get; set; }
        public int User_Id { get; set; }
        [ForeignKey(nameof(User_Id))]
        public User User { get; set; } = null!;
        public decimal Quantity { get; set; }       
        public decimal PricePerUnit { get; set; }
        public decimal TotalPrice { get; set; }
        public Transaction_Type TransactionType { get; set; }
        public DateTimeOffset Timestamp { get; set; }
        public int Product_Id { get; set; }
        [ForeignKey(nameof(Product_Id))]
        public Product Product { get; set; } = null!;

        // public virtual ICollection<Product> Products { get; set;  }
    }
}