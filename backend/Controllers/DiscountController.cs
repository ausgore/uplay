using Microsoft.AspNetCore.Mvc;
using Uplay.Models;

namespace Uplay.Controllers
{
	[ApiController]
	[Route("[controller]")]
	public class DiscountController : ControllerBase
	{
		private readonly Database context;
		public DiscountController(Database _context)
		{
			context = _context;
		}

		[HttpGet()]
		public IActionResult GetDiscounts(int? id)
		{
			IQueryable<Discount> discounts = context.Discounts;
			if (id != null) discounts = discounts.Where(d => d.Id == id);
			return Ok(discounts);
		}

		[HttpGet("get-discount-code/{code}")]
		public IActionResult GetDiscountCode(string code)
		{
			var discount = context.Discounts.Where(d => d.Code.Equals(code.ToLower())).FirstOrDefault();
			if (discount == null) return NotFound();
			return Ok(discount);
		}
	
		[HttpPost("create-discount")]
		public IActionResult CreateDiscount(Discount data)
		{
			if (context.Discounts.Where(d => d.Code.Equals(data.Code.ToLower())).FirstOrDefault() != null) return BadRequest(new { code = "Code already in use" });

			var discount = new Discount()
			{
				Code = data.Code.ToLower(),
				Percentage = data.Percentage
			};
			context.Discounts.Add(discount);
			context.SaveChanges();
			return Ok(discount);
		}

		[HttpPost("update-status/{id}/{status}")]
		public IActionResult UpdateStatus(int id, bool status)
		{
			var discount = context.Discounts.Where(d => d.Id == id).FirstOrDefault();
			if (discount == null) return NotFound();
			discount.Disabled = status;
			context.SaveChanges();
			return Ok(discount);
		}

		[HttpPut("update-discount/{id}")]
		public IActionResult UpdateDiscount(int id, Discount data)
		{
			var discount = context.Discounts.Where(d => d.Id == id).FirstOrDefault();
			if (discount == null) return NotFound();
			if (!discount.Code.Equals(data.Code.ToLower())) {
				if (context.Discounts.Where(d => d.Code.Equals(data.Code.ToLower()) && !d.Code.Equals(discount.Code)).FirstOrDefault() != null) return BadRequest(new { code = "Code already in use" });
			}

			discount.Code = data.Code.ToLower();
			discount.Percentage = data.Percentage;
			context.SaveChanges();
			return Ok(discount);
		}
	}
}