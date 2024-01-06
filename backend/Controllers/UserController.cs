using Microsoft.AspNetCore.Identity.Data;
using Microsoft.AspNetCore.Mvc;
using Uplay.Models;

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

		[HttpGet()]
		public IActionResult Get(string? search)
		{
			IQueryable<User> result = context.Users;
			if (search != null)
			{
				result = result.Where(u => u.Email.Contains(search));
			}
			var list = result.OrderByDescending(u => u.CreatedAt).ToList();
			return Ok(list);
		}

		[HttpPost("register")]
		public IActionResult Register(User request)
		{
			var foundUser = context.Users.Where(u => u.Email == request.Email).FirstOrDefault();
			if (foundUser != null)
			{
				return BadRequest(new { message = "There is already an existing user with this email." });
			}

			var user = new User()
			{
				Email = request.Email.Trim().ToLower(),
				Password = BCrypt.Net.BCrypt.HashPassword(request.Password.Trim()),
				UpdatedAt = DateTime.Now
			};

			context.Users.Add(user);
			context.SaveChanges();
			return Ok(user);
		}

		[HttpPost("login")]
		public IActionResult Login(User request)
		{
			request.Email = request.Email.Trim().ToLower();
			request.Password = request.Password.Trim();
			string message = "Email or password is incorrect.";
			
			var user = context.Users.Where(u => u.Email == request.Email).FirstOrDefault();
			if (user == null)
			{
				return BadRequest(new { message });
			}
			bool verified = BCrypt.Net.BCrypt.Verify(request.Password, user.Password);
			if (!verified)
			{
				return BadRequest(new { message });
			}

			return Ok(user);
		}
	}	
}	