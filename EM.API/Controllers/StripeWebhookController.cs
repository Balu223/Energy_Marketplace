using EM.API.Models;
using EM.API.Models.Enums;
using EM.API.Repositories.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Stripe;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "User,Broker,Admin")]
public class StripeWebhookController : ControllerBase
{
    private readonly IConfiguration _config;
    private readonly IPaymentRepository _paymentRepo;
    private readonly IUserRepository _userRepo;

    public StripeWebhookController(
        IConfiguration config,
        IPaymentRepository paymentRepo,
        IUserRepository userRepo)
    {
        _config = config;
        _paymentRepo = paymentRepo;
        _userRepo = userRepo;
    }

    [HttpPost]
    public async Task<IActionResult> HandleWebhook()
    {
        var json = await new StreamReader(HttpContext.Request.Body).ReadToEndAsync();
        var webhookSecret = _config["Stripe:WebhookSecret"];

        var stripeEvent = EventUtility.ConstructEvent(
            json,
            Request.Headers["Stripe-Signature"],
            webhookSecret
        );

        if (stripeEvent.Type == EventTypes.PaymentIntentSucceeded)
        {
            var paymentIntent = stripeEvent.Data.Object as PaymentIntent;
            if (paymentIntent == null) return BadRequest();

            var userId = int.Parse(paymentIntent.Metadata["user_id"]);
            var credits = int.Parse(paymentIntent.Metadata["credits"]);

            // 1) Stripe_payments táblába mentés
            var payment = new StripePayment
            {
                User_Id = userId,
                StripePaymentIntentId = paymentIntent.Id,
                Amount = (int)paymentIntent.Amount,
                Currency = paymentIntent.Currency,
                PaymentStatus = Enum.Parse<PaymentStatus>(paymentIntent.Status), // "succeeded"
                CreatedAt = DateTime.UtcNow
            };
            await _paymentRepo.AddAsync(payment);

            // 2) User kreditjeinek növelése
            var user = await _userRepo.GetByIdAsync(userId);
            if (user != null)
            {
                user.Credits += credits;
                await _userRepo.UpdateAsync(user);
            }
        }

        return Ok();
    }
}