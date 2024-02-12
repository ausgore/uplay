using Microsoft.AspNetCore.Mvc;
using Uplay.Models;
using System.Security.Cryptography;
using Microsoft.AspNetCore.Identity.Data;
using Microsoft.EntityFrameworkCore;
using System.Net.Mail;
using System.Net;

namespace Uplay.Controllers
{
	[ApiController]
	[Route("[controller]")]
	public class UserController : ControllerBase
	{
		private readonly Database context;
		public UserController(Database _context)
		{
			context = _context;
		}

		// Getting user(s)
		[HttpGet()]
		public IActionResult Get(string? search)
		{
			IQueryable<User> result = context.Users;
			// If a ?search query is provided, it will return all user(s) with emails containing similar values
			if (search != null)
			{
				result = result.Where(u => u.Email.Contains(search));
			}
			return Ok(result.ToList());
		}
		
		[HttpPost("update-user-role/{id}/{role}")]
		public IActionResult UpdateUserRole(int id, string role)
		{
			var user = context.Users.Where(u => u.Id == id).FirstOrDefault();
			if (user == null) return NotFound();
			user.Role = role;
			context.SaveChanges();
			return Ok(user);
		}

		[HttpPost("update-last-visited-announcement/{id}")]
		public IActionResult UpdateLastVisitedAnnouncement(int id)
		{
			var user = context.Users.Where(u => u.Id == id).FirstOrDefault();
			if (user == null) return NotFound();
			user.LastVisitedAnnouncements = DateTime.Now;
			context.SaveChanges();
			return Ok(user);
		}

		// Registering a new user
		[HttpPost("register")]
		public IActionResult Register(User request)
		{
			// Get an existing user in the database with the same email
			// If there is an existing user, return a bad request
			var userWithEmail = context.Users.Where(u => u.Email == request.Email).FirstOrDefault();
			var userWithMobile = context.Users.Where(u => u.MobileNumber == request.MobileNumber).FirstOrDefault();
			
			var errors = new Dictionary<string, string>();

			if (userWithEmail != null || userWithMobile != null)
			{
				if (userWithEmail != null) errors["email"] = "Email already registered.";
				if (userWithMobile != null) errors["mobile"] = "Phone number already registered.";
				else if (request.MobileNumber.Trim().Length != 8) errors["mobile"] = "Invalid mobile number provided.";
				return BadRequest(errors);
			}

			// Create a new user to be stored in the database
			var user = new User()
			{
				Name = request.Name.Trim(),
				Email = request.Email.Trim().ToLower(),
				// Hash password in the database
				Password = BCrypt.Net.BCrypt.HashPassword(request.Password.Trim()),
				MobileNumber = request.MobileNumber.Trim(),
				BirthDate = request.BirthDate
			};
			Console.WriteLine(user);

			context.Users.Add(user);
			context.SaveChanges();
			return Ok(user);
		}

		[HttpPut("update-user/{id}")]
		public IActionResult UpdateUser(int id, User data)
		{
			var errors = new Dictionary<string, string>();
			var user = context.Users.Where(u => u.Id == id).FirstOrDefault();
			if (user == null) return NotFound();
			
			if (data.Email != null) {
				var userWithEmail = context.Users.Where(u => u.Email == data.Email).FirstOrDefault();
				if (userWithEmail != null && userWithEmail.Id != id) errors["email"] = "Email already registered";
			}
			if (data.MobileNumber != null) {
				var userWithPhone = context.Users.Where(u => u.MobileNumber == data.MobileNumber).FirstOrDefault();
				if (userWithPhone != null && userWithPhone.Id != id) errors["mobile"] = "Phone number already registered";
				else if (data.MobileNumber.Length != 8) errors["mobile"] = "invalid mobile number provided";
			}
			if (errors.Count > 0) return BadRequest(errors);
		

			if (data.Name != null) user.Name = data.Name;
			if (data.Email != null) user.Email = data.Email;
			if (data.MobileNumber != null) user.MobileNumber = data.MobileNumber;
			if (data.BirthDate != null) user.BirthDate = data.BirthDate;
			context.SaveChanges();

			return Ok(user);
		}

		// Logging into a new user
		[HttpPost("login")]
		public IActionResult Login(User request)
		{
			request.Email = request.Email.Trim().ToLower();
			request.Password = request.Password.Trim();
			string message = "Email or password is incorrect.";

			// Get an existing user in the database with the same email
			// If there isn't an existing user, return a bad request
			var user = context.Users.Where(u => u.Email == request.Email).FirstOrDefault();
			if (user == null)
			{
				return NotFound(new { message });
			}
			// Check if the provided password and the stored hashed password matches
			// If it doesn't, return a bad request
			bool verified = BCrypt.Net.BCrypt.Verify(request.Password, user.Password);
			if (!verified)
			{
				return BadRequest(new { message });
			}

			return Ok(user);
		}

		// Forget password request
		[HttpPost("forget-password")]
		public IActionResult ForgetPassword([FromQuery] string email)
		{
			var user = context.Users.Where(u => u.Email == email).FirstOrDefault();
			if (user == null)
			{
				return NotFound(new { message = "User not found." });
			}

			// Generating a new token
			var resetCode = GenerateResetCode();
			// Saving token to the database with time limit
			var passwordResetCode = new PasswordResetCode()
			{
				UserId = user.Id,
				ResetCode = resetCode,
				ExpirationDate = DateTime.Now.AddMinutes(15)
			};
			context.PasswordResetCodes.Add(passwordResetCode);
			context.SaveChanges();

			var client = new SmtpClient
			{
				Host = "smtp.gmail.com",
				Port = 587,
				DeliveryMethod = SmtpDeliveryMethod.Network,
				EnableSsl = true,
				Credentials = new NetworkCredential("plcehlder2@gmail.com", "anfx bbtb hjeb wsjo")
			};
			client.SendMailAsync(from: "plcehlder2@gmail.com", recipients: email, subject: "Uplay password reset", $"Please click the following link to reset your password: http://localhost:5173/reset-password/{resetCode}?email={email}");

			return Ok(passwordResetCode);
		}

		// Reset password process
		[HttpPost("reset-password")]
		public IActionResult ResetPassword([FromBody] ResetPasswordRequest request)
		{
			// Find user by email
			var user = context.Users.Where(u => u.Email == request.Email).FirstOrDefault();
			if (user == null)
			{
				return NotFound(new { message = "User not found." });
			}

			// Check if reset code is valid
			var resetCodeEntry = context.PasswordResetCodes.Where(c => c.ResetCode == request.ResetCode && c.UserId == user.Id).FirstOrDefault();
			if (resetCodeEntry == null || resetCodeEntry.ExpirationDate < DateTime.Now)
			{
				return BadRequest(new { message = "Invalid or expired token." });
			}

			// Hash the new password and update user
			user.Password = BCrypt.Net.BCrypt.HashPassword(request.NewPassword);
			context.Users.Update(user);

			// Remove reset code entry from the database
			context.PasswordResetCodes.Remove(resetCodeEntry);
			context.SaveChanges();

			return Ok(new { message = "Password has been successfully reset.", user });
		}

		[HttpGet("cart/{userId}")]
		public IActionResult GetCarts(int userId)
		{
			var user = context.Users.Where(u => u.Id == userId).FirstOrDefault();
			if (user == null) return NotFound();

			var cart = context.Carts.Where(c => c.UserId == userId).Include(c => c.Activity);
			return Ok(cart.ToList());
		}

		[HttpPost("add-to-cart")]
		public IActionResult AddToCart(Cart data)
		{
			var user = context.Users.Where(u => u.Id == data.UserId).FirstOrDefault();
			if (user == null) return NotFound();

			var activity = context.Activities.Where(a => a.Id == data.ActivityId).FirstOrDefault();
			if (activity == null) return NotFound();

			var cart = new Cart()
			{
				UserId = data.UserId,
				ChildQuantity = data.ChildQuantity,
				AdultQuantity = data.AdultQuantity,
				ActivityId = data.ActivityId,
				Timeslot = data.Timeslot,
				BookedDate = data.BookedDate
			};

			context.Carts.Add(cart);
			user.Cart.Add(cart);
			context.SaveChanges();

			return Ok(cart);
		}

		[HttpPut("update-cart/{id}")]
		public IActionResult UpdateCart([FromRoute] int id, [FromBody] Cart data)
		{
			var cart = context.Carts.Where(c => c.Id == id).FirstOrDefault();
			if (cart == null)
			{
				return NotFound(new { message = "Cart cannot be found with ID." });
			}

			if (data.AdultQuantity.HasValue && data.AdultQuantity.Value != cart.AdultQuantity) cart.AdultQuantity = data.AdultQuantity;
			if (data.ChildQuantity.HasValue && data.ChildQuantity.Value != cart.ChildQuantity) cart.ChildQuantity = data.ChildQuantity;

			context.Carts.Update(cart);
			context.SaveChanges();

			return Ok(cart);
		}

		[HttpDelete("delete-cart/{id}")]
		public IActionResult DeleteCart([FromRoute] int id)
		{
			var cart = context.Carts.Where(c => c.Id == id).FirstOrDefault();
			if (cart == null)
			{
				return NotFound();
			}

			var user = context.Users.Where(u => u.Id == cart.UserId).FirstOrDefault();
			if (user == null) return NotFound();

			context.Carts.Remove(cart);
			user.Cart.Remove(cart);
			context.SaveChanges();
			return Ok(new { message = "Deleted" });
		}


		// Generating a new token for forget-password sequence
		private static string GenerateResetCode()
		{
			var tokenByte = new byte[32];
			RandomNumberGenerator.Fill(tokenByte);
			return Convert.ToBase64String(tokenByte)
				.Replace('+', '-')
				.Replace('/', '_')
				.TrimEnd('=');
		}
	}
}