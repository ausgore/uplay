using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Uplay.Models
{
	public class User 
	{
		[Key]
		[DatabaseGenerated(DatabaseGeneratedOption.Identity)]
		public int Id { get; set; }

		[Required]
		public string Email { get; set; } = string.Empty;

		[Column(TypeName = "datetime")]
		public DateTime CreatedAt { get; private set; } = DateTime.Now;

		[Column(TypeName = "datetime")]
		public DateTime UpdatedAt { get; set; } = DateTime.Now;
	}
}