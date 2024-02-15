using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace Uplay.Models
{
	public class Cart
	{
		[Key]
		[DatabaseGenerated(DatabaseGeneratedOption.Identity)]
		public int Id { get; set; }

		public int? ChildQuantity { get; set; } = 0;

		public int? AdultQuantity { get; set; } = 0;

		[ForeignKey("Activity")]
		public int ActivityId { get; set; }

		[ForeignKey("Discount")]
		public int? DiscountId { get; set; }
		
		public virtual Discount? Discount { get; set; }
		
		public string? Timeslot { get; set; } = string.Empty;
		
		public DateTime? BookedDate { get; set; }

		public virtual Activity? Activity { get; set; }


		[ForeignKey("User")]
		public int UserId { get; set; }

		[JsonIgnore]
		public User? User { get; set; }
	}
}