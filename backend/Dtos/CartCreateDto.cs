using System.ComponentModel.DataAnnotations;

namespace Uplay.Dtos
{
	public class CartCreateDto
	{
		[Required]
		public int UserId { get; set; }

		[Required]
		public string Name { get; set; } = string.Empty;

		public int? NtucQuantity { get; set; }
		public int? GuestQuantity { get; set; }
	}
}