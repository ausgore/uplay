using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace Uplay.Models
{
	public class User 
	{
		[Key]
		[DatabaseGenerated(DatabaseGeneratedOption.Identity)]
		public int Id { get; set; }

		[Required]
		public string Email { get; set; } = string.Empty;

		[Required, JsonIgnore]
		public string Password { get; set; } = string.Empty;

		[Column(TypeName = "datetime")]
		public DateTime CreatedAt { get; private set; } = DateTime.Now;

		[Column(TypeName = "datetime")]
		public DateTime UpdatedAt { get; set; } = DateTime.Now;
		
	}
}