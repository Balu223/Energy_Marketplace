using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using EM.API.Models.Enums;
using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace EM.API.Models
{
    public class Product
    {
        public Product() {}

        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Product_Id { get; set; }
        [Required]
        public string Product_Name { get; set; } = null!;
        [Required]
        public int Initial_Quantity { get; set; }
        [Required]
        public int Current_Quantity { get; set; }
        [Required]
        public Units Unit { get; set; }
        public decimal Sale_Price_Per_Unit { get; set; }
        public decimal Purchase_Price_Per_Unit { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime? UpdatedDate { get; set; }
    }
}