using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace Uplay.Models
{
	public class Review
	{
		[Key]
		[DatabaseGenerated(DatabaseGeneratedOption.Identity)]
		public int Id { get; set; }

		[ForeignKey("User")]
		public int UserId { get; set; }
		
		public User? User { get; set; }

		[ForeignKey("Activity")]
		public int ActivityId { get; set; }

		[JsonIgnore]
		public virtual Activity? Activity { get; set; }

		public int Rating { get; set; } = 1;

		public string Content { get; set; } = string.Empty;
	}
}