using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore.Metadata.Internal;

namespace backend.Models
{
    public class ChatbotPrompt
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        public string Category { get; set; } = string.Empty;

        public string Question { get; set; } = string.Empty;

        public string Answer {  get; set; } = string.Empty;
      
        [Column(TypeName = "datetime")]
        public DateTime CreatdedAt { get; set; }

        [Column(TypeName = "datetime")]
        public DateTime UpdatedAt {  get; set; }
    }
}
