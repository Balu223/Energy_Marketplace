using System.ComponentModel.DataAnnotations;

namespace EM.API.Models.Enums
{
    public enum Units
    {
        [Display(Name = "kWh")]
        kWh,
        [Display(Name = "m3")]
        m3,
        [Display(Name = "liters")]
        liters
    }
}