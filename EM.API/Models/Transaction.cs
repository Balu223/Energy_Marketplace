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
            Transaction_Id = Guid.NewGuid();
            Timestamp = DateTimeOffset.UtcNow;
            Products = new HashSet<Product>();
        }

        public Guid Transaction_Id { get; set; }
        public Guid User_Id { get; set; }
        public User User { get; set; } = null!;
        public decimal Quantity { get; set; }       
        public decimal PricePerUnit { get; set; }
        public decimal TotalPrice => Math.Round(Quantity * PricePerUnit, 2);
        public Transaction_Type TransactionType { get; set; }
        public DateTimeOffset Timestamp { get; set; }


        public virtual ICollection<Product> Products { get; set;  }
    }
}