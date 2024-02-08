using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Permissions;
using Uplay.Models;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;

namespace Uplay.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ChatbotPromptController : ControllerBase
    {
        private readonly Database context;
        public ChatbotPromptController(Database _context)
        {
            context = _context;
        }

        [HttpGet()]
        public IActionResult GetPrompts(int? id, string sortBy = "dateDesc", string search= "")
        {
            IQueryable<ChatbotPrompt> result = context.Prompts;
            if (id != null)
            {
                result = result.Where(p => p.Id == id);
            }
            else
            {
                if (!string.IsNullOrEmpty(search))
                {
                    result = result.Where(p => p.Question.ToLower().Contains(search) || p.Category.ToLower().Contains(search) || p.Answer.ToLower().Contains(search));
                }

                if (sortBy == "dateDesc")
                {
                    result = result.OrderByDescending(p => p.UpdatedAt);
                }
                else if (sortBy == "dateAsc")
                {
                    result = result.OrderBy(p => p.UpdatedAt);
                }
                else if (sortBy == "categoryDesc")
                {
                    result = result.OrderByDescending(p => p.Category).ThenByDescending(p => p.UpdatedAt);
                }
                else if (sortBy == "categoryAsc")
                {
                    result = result.OrderBy(p => p.Category).ThenByDescending(p => p.UpdatedAt);
                }
                else
                {
                    BadRequest("Invalid parameter");
                }
            }
            return Ok(result.ToList());
           
        }

        [HttpPost("create")]
        public IActionResult CreatePrompt(ChatbotPrompt data)
        {
            var now = DateTime.Now;
            var prompt = new ChatbotPrompt()
            {
                Category = data.Category,
                Question = data.Question,
                Answer = data.Answer,
                CreatedAt = now,
                UpdatedAt = now

            };
            context.Prompts.Add(prompt);
            context.SaveChanges();
            
            return Ok(prompt);

        }

        [HttpDelete("delete/{promptId}")]
        public IActionResult DeletePrompt(int promptId) 
        {
            var prompt = context.Prompts.Where(p => p.Id == promptId).FirstOrDefault();
            if (prompt == null) return NotFound();

            context.Prompts.Remove(prompt);
            context.SaveChanges();
            return Ok();
        }

        [HttpPut("update/{promptId}")]
        public IActionResult UpdatePrompt(int promptId, ChatbotPrompt data)
        {
            var prompt = context.Prompts.Where(p => p.Id == promptId).FirstOrDefault();
            if (prompt == null) return NotFound();

            prompt.Category = data.Category;
            prompt.Question = data.Question;
            prompt.Answer = data.Answer;
            prompt.UpdatedAt = DateTime.Now;
            
            context.SaveChanges();
            return Ok();
        }
    }
}
