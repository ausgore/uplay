using Microsoft.AspNetCore.Mvc;
using Uplay.Models;

namespace Uplay.Controllers
{
	[ApiController]
	[Route("[controller]")]
	public class AnnouncementController : ControllerBase
		{
			private readonly Database context;
		public AnnouncementController(Database _context)
		{
			context = _context;
		}
		
		[HttpGet()]
		public IActionResult GetAnnouncements()
		{
			return Ok(context.Announcements.ToList());
		}

		[HttpPost("create")]
		public IActionResult CreateAnnouncement(Announcement data)
		{
			var announcement = new Announcement()
			{
				Title = data.Title,
				Description = data.Description,
				CreatedAt = DateTime.Now
			};

			context.Announcements.Add(announcement);
			context.SaveChanges();
			return Ok(announcement);
		}

		[HttpGet("latest")]
		public IActionResult GetLatestAnnouncement()
		{
			var latestAnnouncement = context.Announcements
				.OrderByDescending(a => a.CreatedAt)
				.FirstOrDefault();
			if (latestAnnouncement == null) return Ok(null);
			return Ok(latestAnnouncement.CreatedAt);
		}
	}
}