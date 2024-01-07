using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

// TODO: This cart should be referencing the Activity and not directly the "Quantity" in the future

namespace Uplay.Models
{
	public class Cart
	{
		[Key]
		[DatabaseGenerated(DatabaseGeneratedOption.Identity)]
		public int Id { get; set; }

		[Required]
		public string Name { get; set; } = string.Empty;

		public int? NtucQuantity { get; set; } = 0;

		public int? GuestQuantity { get; set; } = 0;

		[Required]
		public int UserId { get; set; }
	}
}