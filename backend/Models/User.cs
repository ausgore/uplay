using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Uplay.Models
{
	public class User 
	{
		[Key]
		[DatabaseGenerated(DatabaseGeneratedOption.Identity)]
		public int Id { get; set; }

		public string Name { get; set; } = string.Empty;

		public string Email { get; set; } = string.Empty;

		public string Password { get; set; } = string.Empty;

		public string Role { get; set; } = "User";

		public string MobileNumber { get; set; } = string.Empty;

		public DateTime LastVisitedAnnouncements { get; set; }

		public DateTime BirthDate { get; set; }

		public virtual ICollection<Cart> Cart { get; set; } = new List<Cart>();
	}

	public class PasswordResetCode
	{
		[Key]
		[DatabaseGenerated(DatabaseGeneratedOption.Identity)]
		public int Id { get; set; }

		[ForeignKey("User")]
		public int UserId { get; set; }

		public string ResetCode { get; set; } = string.Empty;

		[Column(TypeName = "datetime")]
		public DateTime ExpirationDate { get; set; }
	
		public User? User { get; set; }
	}
}