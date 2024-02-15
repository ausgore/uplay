using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Uplay.Models;

namespace Uplay.Controllers
{
	[ApiController]
	[Route("[controller]")]
	public class BookingController : ControllerBase
	{
		private readonly Database context;
		public BookingController(Database _context)
		{
			context = _context;
		}

		[HttpPost("add-review/{bookingId}/{reviewId}")]
		public IActionResult AddReviewToBooking(int bookingId, int reviewId)
		{
			var booking = context.Bookings.Where(b => b.Id == bookingId).FirstOrDefault();
			if (booking == null) return NotFound();
			
			var review = context.Reviews.Where(r => r.Id == reviewId).FirstOrDefault();
			if (review == null) return NotFound();

			booking.ReviewId = reviewId;
			context.SaveChanges();
			return Ok(booking);
		}

		[HttpGet("get-booking/{bookingId}")]
		public IActionResult GetBooking(int bookingId)
		{
			var booking = context.Bookings
				.Include(b => b.Review)
				.Where(b => b.Id == bookingId)
				.FirstOrDefault();
			return Ok(booking);
		}

		[HttpGet("get-bookings/{userId}")]
		public IActionResult GetBookingsForUser(int userId)
		{
			var bookings = context.Bookings.Where(b => b.UserId == userId);
			return Ok(bookings.ToList());
		}

		[HttpPost("create/{cartId}")]
		public IActionResult CreateBooking(int cartId, Booking data)
		{
			var cart = context.Carts.Where(c => c.Id == cartId).FirstOrDefault();
			if (cart == null) return NotFound();
			var user = context.Users.Where(u => u.Id == cart.UserId).FirstOrDefault();
			if (user == null) return NotFound();

			context.Carts.Remove(cart);
			user.Cart.Remove(cart);

			var booking = new Booking()
			{
				UserId = user.Id,
				BookedDate = data.BookedDate,
				ActivityId = data.ActivityId,
				ActivityName = data.ActivityName,
				DiscountName = data.DiscountName ?? null,
				AppliedDiscount = data.AppliedDiscount ?? null,
				Timeslot = data.Timeslot,
				ActivityPostalCode = data.ActivityPostalCode,
				ChildQuantity = data.ChildQuantity ?? 0,
				AdultQuantity = data.AdultQuantity ?? 0,
				InitialAdultPrice = data.InitialAdultPrice ?? null,
				InitialChildPrice = data.InitialChildPrice ?? null
			};
			context.Bookings.Add(booking);
			
			context.SaveChanges();
			return Ok(booking);
		}
	}
}