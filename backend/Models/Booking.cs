using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace Uplay.Models
{
	public class Booking
	{
		[Key]
		[DatabaseGenerated(DatabaseGeneratedOption.Identity)]
		public int Id { get; set; }

		public DateTime BookedDate { get; set; }
		public string? Timeslot { get; set; } = string.Empty;


		[ForeignKey("User")]
		public int UserId { get; set; }
		public User? User { get; set; }

		[ForeignKey("Activity")]
		public int? ActivityId { get; set; }

		[JsonIgnore]
		public virtual Activity? Activity { get; set; }

		public string ActivityName { get; set; } = string.Empty;
		public string ActivityPostalCode { get; set; } = string.Empty;

		public int? ChildQuantity { get; set; } = 0;
		public int? AdultQuantity { get; set; } = 0;

		public string? DiscountName { get; set; }
		public int? AppliedDiscount { get; set; }

		public int? InitialChildPrice { get; set; } = null;
		public int? InitialAdultPrice { get; set; } = null;

		[ForeignKey("Review")]
		public int? ReviewId { get; set; }
		public Review? Review { get; set; }
	}
}