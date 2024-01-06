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
	}
}