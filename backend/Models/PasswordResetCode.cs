using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Uplay.Models
{
	public class PasswordResetCode
	{
		[Key]
		[DatabaseGenerated(DatabaseGeneratedOption.Identity)]
		public int Id { get; set; }

		[Required]
		[ForeignKey("User")]
		public int UserId { get; set; }

		[Required]
		public string ResetCode { get; set; } = string.Empty;

		[Column(TypeName = "datetime")]
		public DateTime ExpirationDate { get; set; }
	
		public User? User { get; set; }
	}
}