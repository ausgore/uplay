using Microsoft.EntityFrameworkCore;
using Uplay.Models;

namespace Uplay
{
	public class Database : DbContext
	{
		private readonly IConfiguration configuration;

		public Database(IConfiguration _configuration) 
		{
			configuration = _configuration;
		}

		protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
		{
			base.OnConfiguring(optionsBuilder);
			optionsBuilder.UseSqlite(configuration.GetConnectionString("Sqlite"));
		}

		public required DbSet<User> Users { get; set; }
		public required DbSet<Discount> Discounts { get; set; }
		public required DbSet<PasswordResetCode> PasswordResetCodes { get; set; }
		public required DbSet<Announcement> Announcements { get; set; }
		public required DbSet<Activity> Activities { get; set; }
		public required DbSet<Review> Reviews { get; set; }
		public required DbSet<ActivityTimeslot> ActivityTimeslots { get; set; }
		public required DbSet<ActivityTag> ActivityTags { get; set; }
		public required DbSet<Cart> Carts { get; set; }
		public required DbSet<Booking> Bookings { get; set; }
  		public required DbSet<ChatbotPrompt> Prompts { get; set; }
  
	}
}
