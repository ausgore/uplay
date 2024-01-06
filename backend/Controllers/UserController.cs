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

		[HttpGet("{search}")]
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
		
		[HttpPost("add")]
		public IActionResult Add(User data)
		{
			var user = new User()
			{
				Email = data.Email,
				UpdatedAt = DateTime.Now
			};

			context.Users.Add(user);
			context.SaveChanges();
			return Ok(user);
		}
	}	
}	