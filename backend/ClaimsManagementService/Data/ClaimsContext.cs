using Microsoft.EntityFrameworkCore;
using ClaimsManagementService.Models;

namespace ClaimsManagementService.Data
{
    public class ClaimsContext : DbContext
    {
        public ClaimsContext(DbContextOptions<ClaimsContext> options)
            : base(options)
        {
        }

        public DbSet<Claim> Claims { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Seed initial data
            modelBuilder.Entity<Claim>().HasData(
                new Claim { Id = 1, PolicyNumber = "PN12345", DateOfLoss = new DateTime(2024, 6, 16), CauseOfLoss = "Fire", ClaimAmount = 1000.00M, Status = "Open", ClaimType = "Home" },
                new Claim { Id = 2, PolicyNumber = "PN12346", DateOfLoss = new DateTime(2024, 5, 10), CauseOfLoss = "Flood", ClaimAmount = 1500.00M, Status = "Closed", ClaimType = "Auto" }
            );
        }
    }
}
