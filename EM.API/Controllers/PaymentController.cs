using EM.API.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using EM.API.Services.DTOs;
using Stripe;
using EM.API.Models;
using EM.API.Models.Enums;
using EM.API.Repositories.Interfaces;

public class AdminUserController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly IPaymentRepository _paymentRepository;

        public AdminUserController(IUserService userService, IPaymentRepository paymentRepository)
        {
            _userService = userService;
            _paymentRepository = paymentRepository;
        }
        [HttpPost("payments/create-intent")]
    public async Task<IActionResult> CreatePaymentIntent([FromBody] CreateCreditPaymentDto dto)
    {
    var amountPerCredit = 1;
    var amount = dto.Amount * amountPerCredit;

    var user = _userService.GetCurrentProfileAsync();

    var options = new PaymentIntentCreateOptions
    {
        Amount = amount,
        Currency = "huf",
        AutomaticPaymentMethods = new PaymentIntentAutomaticPaymentMethodsOptions
        {
            Enabled = true,
        },
        Metadata = new Dictionary<string, string>
        {
            { "user_id", user.Id.ToString() },
            { "credits", dto.Amount.ToString() }
        }
    };

    var service = new PaymentIntentService();
    var intent = await service.CreateAsync(options);

    // Mentés DB-be
    var payment = new StripePayment
    {
        User_Id = user.Id,
        StripePaymentIntentId = intent.Id,
        Amount = amount,
        Currency = "huf",
        PaymentStatus = Enum.Parse<PaymentStatus>(intent.Status, ignoreCase: true),
        CreatedAt = DateTime.UtcNow
    };
    await _paymentRepository.AddAsync(payment);

    return Ok(new { clientSecret = intent.ClientSecret });
    }
}