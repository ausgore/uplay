using Microsoft.AspNetCore.Mvc;
using Uplay.Models;
using System.Security.Cryptography;
using Microsoft.AspNetCore.Identity.Data;
using Uplay.Dtos;

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
			var list = result.OrderByDescending(u => u.CreatedAt).ToList();
			return Ok(list);
		}

		// Registering a new user
		[HttpPost("register")]
		public IActionResult Register(User request)
		{
			// Get an existing user in the database with the same email
			// If there is an existing user, return a bad request
			var foundUser = context.Users.Where(u => u.Email == request.Email).FirstOrDefault();
			if (foundUser != null)
			{
				return BadRequest(new { message = "There is already an existing user with this email." });
			}

			// Create a new user to be stored in the database
			var user = new User()
			{
				Email = request.Email.Trim().ToLower(),
				// Hash password in the database
				Password = BCrypt.Net.BCrypt.HashPassword(request.Password.Trim()),
				UpdatedAt = DateTime.Now
			};

			context.Users.Add(user);
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

		[HttpGet("cart/{id}")]
		public IActionResult GetCarts(int id)
		{
			var user = context.Users.Where(u => u.Id == id).FirstOrDefault();
			if (user == null) return NotFound();
			
			var carts = context.Carts.Where(c => c.UserId == id).ToList();
			return Ok(carts);
		}

		// TODO: CART Change after model
		[HttpPost("add-to-cart")]
		public IActionResult AddToCart(CartCreateDto data)
		{
			var user = context.Users.Where(u => u.Id == data.UserId).FirstOrDefault();
			if (user == null) return NotFound();

			var cart = new Cart()
			{
				UserId = data.UserId,
				Name = data.Name,
				NtucQuantity = data.NtucQuantity ?? 0,
				GuestQuantity = data.GuestQuantity ?? 0,
			};

			context.Carts.Add(cart);
			context.SaveChanges();

			return Ok(cart);
		}

		[HttpPut("update-cart/{id}")]
		public IActionResult UpdateCart([FromRoute] int id, [FromBody] CartUpdateDto data)
		{
			var cart = context.Carts.Where(c => c.Id == id).FirstOrDefault();
			if (cart == null)
			{
				return NotFound(new { message = "Cart cannot be found with ID." });
			}

			if (data.GuestQuantity.HasValue && data.GuestQuantity.Value != cart.GuestQuantity) cart.GuestQuantity = data.GuestQuantity.Value;
			if (data.NtucQuantity.HasValue && data.NtucQuantity.Value != cart.NtucQuantity) cart.NtucQuantity = data.NtucQuantity.Value;

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

			context.Carts.Remove(cart);
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