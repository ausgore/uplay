using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Uplay.Models;

namespace Uplay.Controllers
{
	[ApiController]
	[Route("[controller]")]
	public class ActivityController : ControllerBase
	{
		private readonly Database context;
		public ActivityController(Database _context)
		{
			context = _context;
		}

		[HttpGet()]
		public IActionResult GetActivity(int? id)
		{
			IQueryable<Activity> result = context.Activities;
			if (id != null) {
				result = result.Where(a => a.Id == id);
			}

			result = result
				.Include(a => a.Timeslots)
				.Include(a => a.Tags)
				.Include(a => a.Reviews);

			return Ok(result.ToList());
		}

		[HttpPost("create")]
		public IActionResult CreateActivity(Activity data)
		{
			var activity = new Activity()
			{
				Name = data.Name,
				PostalCode = data.PostalCode,
				ChildPrice = data.ChildPrice ?? null,
				AdultPrice = data.AdultPrice ?? null,
				Description = data.Description,
				IsDaily = data.IsDaily,
				StartingAt = data.StartingAt ?? null,
				EndingAt = data.EndingAt ?? null
			};

			context.Activities.Add(activity);
			context.SaveChanges();

			return Ok(activity);
		}

		[HttpDelete("delete/{activityId}")]
		public IActionResult DeleteActivity(int activityId)
		{
			var activity = context.Activities.Where(a => a.Id == activityId).FirstOrDefault();
			if (activity == null) return NotFound();

			context.Activities.Remove(activity);
			context.SaveChanges();
			return Ok();
		}

		[HttpPut("update/{activityId}")]
		public IActionResult UpdateActivity(int activityId, Activity data)
		{
			var activity = context.Activities.Where(a => a.Id == activityId)
				.Include(a => a.Timeslots)
				.Include(a => a.Tags)
				.FirstOrDefault();
			if (activity == null) return NotFound();

			activity.Name = data.Name;
			activity.PostalCode = data.PostalCode;
			activity.ChildPrice = data.ChildPrice;
			activity.AdultPrice = data.AdultPrice;
			activity.Description = data.Description;
			activity.IsDaily = data.IsDaily;
			activity.StartingAt = data.StartingAt ?? null;
			activity.EndingAt = data.EndingAt ?? null;
			context.SaveChanges();

			return Ok(activity);
		}

		[HttpPost("add-timeslot/{id}")]
		public IActionResult AssignTimeslotToActivity(int id, [FromBody] ActivityTimeslot data)
		{
			var activity = context.Activities.Where(a => a.Id == id).Include(a => a.Timeslots).FirstOrDefault();
			if (activity == null) return NotFound();

			var timeslot = new ActivityTimeslot()
			{
				Timeslot = data.Timeslot,
				ActivityId = activity.Id
			};

			activity.Timeslots.Add(timeslot);
			context.ActivityTimeslots.Add(timeslot);
			context.SaveChanges();

			return Ok(activity);
		}

		[HttpPut("remove-timeslot/{activityId}/{timeslotId}")]
		public IActionResult RemoveTimeslotFromActivity(int activityId, int timeslotId)
		{
			var activity = context.Activities.Where(a => a.Id == activityId).Include(a => a.Timeslots).FirstOrDefault();
			if (activity == null) return NotFound();

			var timeslot = context.ActivityTimeslots.Where(t => t.Id == timeslotId && t.ActivityId == activityId).FirstOrDefault();
			if (timeslot == null) return NotFound();

			activity.Timeslots.Remove(timeslot);
			context.ActivityTimeslots.Remove(timeslot);
			context.SaveChanges();

			return Ok(activity);
		}

		[HttpPost("add-tag/{activityId}")]
		public IActionResult AddTagsToActivity(int activityId, [FromBody] List<ActivityTag> tags)
		{
			var activity = context.Activities.Where(a => a.Id == activityId).Include(a => a.Tags).FirstOrDefault();
			if (activity == null) return NotFound();

			foreach (var data in tags)
			{
				var tag = new ActivityTag()
				{
					Content = data.Content,
					ActivityId = activityId
				};
				activity.Tags.Add(tag);
				context.ActivityTags.Add(tag);
			}
			
			context.SaveChanges();
			return Ok(activity);
		}

		[HttpPut("set-tags/{activityId}")]
		public IActionResult SetTagsToActivity(int activityId, [FromBody] List<ActivityTag> tags)
		{
			var activity = context.Activities.Where(a => a.Id == activityId).Include(a => a.Tags).FirstOrDefault();
			if (activity == null) return NotFound(new { message = "hi" });

			activity.Tags.Clear();
			foreach (var tag in activity.Tags)
			{
				context.ActivityTags.Remove(tag);
			}

			foreach (var data in tags)
			{
				var tag = new ActivityTag()
				{
					Content = data.Content,
					ActivityId = activityId
				};
				activity.Tags.Add(tag);
				context.ActivityTags.Add(tag);
			}

			context.SaveChanges();
			return Ok(activity);
		}

		[HttpPost("submit-review/{activityId}")]
		public IActionResult SubmitReview(int activityId, [FromBody] Review data) {
			var activity = context.Activities.Where(a => a.Id == activityId).Include(a => a.Reviews).FirstOrDefault();
			if (activity == null) return NotFound();

			var review = new Review()
			{
				UserId = data.UserId,
				ActivityId = activity.Id,
				Rating = data.Rating,
				Content = data.Content
			};

			activity.Reviews.Add(review);
			context.Reviews.Add(review);
			context.SaveChanges();

			return Ok(activity);
		}
	}
}