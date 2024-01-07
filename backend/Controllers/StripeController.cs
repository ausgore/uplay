using Microsoft.AspNetCore.Mvc;
using Stripe;
using Uplay.Dtos;

namespace Uplay.Controllers
{
	[ApiController]
	[Route("[controller]")]
	public class StripeController : ControllerBase
	{
		[HttpPost("create-payment-intent")]
		public IActionResult CreatePaymentIntent([FromBody] PaymentRequestDto request)
		{
			var paymentIntentService = new PaymentIntentService();
			var createOptions = new PaymentIntentCreateOptions
			{
				Amount = request.Amount,
				Currency = "sgd"
			};

			var paymentIntent = paymentIntentService.Create(createOptions);
			return Ok(new { clientSecret = paymentIntent.ClientSecret });
		}
	}
}