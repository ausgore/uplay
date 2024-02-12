using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Uplay.Models
{
	public class Announcement
	{
		[Key]
		[DatabaseGenerated(DatabaseGeneratedOption.Identity)]
		public int Id { get; set; }

		public string Title { get; set; } = string.Empty;
	
		public string Description { get; set; } = string.Empty;

		public DateTime CreatedAt { get; set; }
	}
}