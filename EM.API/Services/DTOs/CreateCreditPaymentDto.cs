namespace EM.API.Services.DTOs
{
    public class CreateCreditPaymentDto
    {
        public int UserId { get; set; }
        public string PaymentIntentId {get; set;} = "";
        public int Amount {get;set;}
        public string Currency {get;set;} ="HUF";
        public string Status {get;set;} ="";


    }
}