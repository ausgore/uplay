using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace Uplay.Models
{
	public class Activity 
	{
		[Key]
		[DatabaseGenerated(DatabaseGeneratedOption.Identity)]
		public int Id { get; set; }

		public string PostalCode { get; set; } = string.Empty;

		public string Category { get; set; } = string.Empty;

		public string Subcategory { get; set; } = string.Empty;

		public string Name { get; set; } = string.Empty;

		public int? ChildPrice { get; set; } = null;

		public int? AdultPrice { get; set; } = null;

		public string? Description { get; set; } = string.Empty;

		public bool IsDaily { get; set; }

		[Column(TypeName = "datetime")]
		public DateTime? StartingAt { get; set; }

		[Column(TypeName = "datetime")]
		public DateTime? EndingAt { get; set; }

		public virtual ICollection<Review> Reviews { get; set; } = new List<Review>();

		public virtual ICollection<ActivityTimeslot> Timeslots { get; set; } = new List<ActivityTimeslot>();

		public virtual ICollection<ActivityTag> Tags { get; set; } = new List<ActivityTag>();
	}

	public class ActivityTimeslot 
	{
		[Key]
		[DatabaseGenerated(DatabaseGeneratedOption.Identity)]
		public int Id { get; set; }

		[Column(TypeName = "time")]
		public TimeSpan Timeslot { get; set; }

		[ForeignKey("Activity")]
		public int ActivityId { get; set; }

		[JsonIgnore]
		public virtual Activity? Activity { get; set; }
	}

	public class ActivityTag
	{
		[Key]
		[DatabaseGenerated(DatabaseGeneratedOption.Identity)]
		public int Id { get; set; }
	
		public string Content { get; set; } = string.Empty;

		[ForeignKey("Activity")]
		public int ActivityId { get; set; }

		[JsonIgnore]
		public virtual Activity? Activity { get; set; }
	}
}