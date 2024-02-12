using Microsoft.AspNetCore.Mvc;
using Stripe;

namespace Uplay.Controllers
{
	[ApiController]
	[Route("[controller]")]
	public class StripeController : ControllerBase
	{
		[HttpGet("config")]
		public IActionResult GetPublishableKey()
		{
			return Ok(new { publishableKey = "pk_test_51NnHKDLBQ2JqxfdOjNLPRf0fVoRRLwnEoyTxqVX8dI9ls9A9GDYFnHytjL8OZOWIgcZpcqlvgUkHAraYRMDcqb6d00vvqISnXP" });
		}

		[HttpPost("create-payment-intent/{amount}")]
		public IActionResult CreatePaymentIntent(int amount)
		{
			var options = new PaymentIntentCreateOptions
			{
				Amount = amount * 100,
				Currency = "sgd",
				AutomaticPaymentMethods = new PaymentIntentAutomaticPaymentMethodsOptions
				{
					Enabled = true,
				},
			};
			var service = new PaymentIntentService();
			var paymentIntent = service.Create(options);
			return Ok(new { clientSecret = paymentIntent.ClientSecret });
		}
	}
}