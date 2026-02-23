using EM.API.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using EM.API.Services.DTOs;
using Stripe;
using EM.API.Models;
using EM.API.Models.Enums;
using EM.API.Repositories.Interfaces;
using Stripe.V2.Core;
using Microsoft.AspNetCore.Authorization;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "User,Broker,Admin")]
public class PaymentsController : ControllerBase
{
    private readonly IPaymentService _paymentService;

    public PaymentsController(IPaymentService paymentService)
    {
        _paymentService = paymentService;
    }

    [HttpPost("create-payment-intent")]
    public async Task<ActionResult<BuyCreditsResponse>> CreatePaymentIntent(
        [FromBody] BuyCreditsRequest request)
    {
        var userId = int.Parse(User.FindFirst("sub")?.Value ?? "0");
        // vagy ahogy nálad jön a userId a tokenből

        var result = await _paymentService.CreatePaymentIntentAsync(userId, request.Credits);
        return Ok(result);
    }
}