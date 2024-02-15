using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Uplay.Models
{
	public class Discount
	{
		[Key]
		[DatabaseGenerated(DatabaseGeneratedOption.Identity)]
		public int Id { get; set; }

		public string Code { get; set; } = string.Empty;

		public float Percentage { get; set; }

		public bool Disabled { get; set; } = false;
	}
}