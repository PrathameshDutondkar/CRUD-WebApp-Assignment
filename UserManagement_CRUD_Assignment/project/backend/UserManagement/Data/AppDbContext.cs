using Microsoft.EntityFrameworkCore;
using UserManagement.Models;

namespace UserManagement.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<User> Users { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<User>(entity =>
            {
                entity.ToTable("Users");
                entity.HasKey(e => e.Id);

                entity.Property(e => e.Id)
                      .UseIdentityColumn();

                entity.Property(e => e.FirstName)
                      .IsRequired()
                      .HasMaxLength(100);

                entity.Property(e => e.LastName)
                      .IsRequired()
                      .HasMaxLength(100);

                entity.Property(e => e.Gender)
                      .IsRequired()
                      .HasMaxLength(10);

                entity.Property(e => e.Email)
                      .IsRequired()
                      .HasMaxLength(200);

                entity.Property(e => e.MobileNo)
                      .IsRequired()
                      .HasMaxLength(10);

                entity.Property(e => e.City)
                      .IsRequired()
                      .HasMaxLength(100);

                entity.Property(e => e.PhotoPath)
                      .HasMaxLength(500);

                entity.Property(e => e.ProfessionalSkills)
                      .HasMaxLength(500)
                      .HasDefaultValue("");

                // Seed sample data
                entity.HasData(
                    new User
                    {
                        Id = 1,
                        FirstName = "Rajesh",
                        LastName = "Sharma",
                        Gender = "Male",
                        Email = "rajesh.sharma@example.com",
                        MobileNo = "9876543210",
                        DateOfBirth = new DateTime(1995, 6, 15),
                        City = "Pune",
                        ProfessionalSkills = "Communication,Problem Solving",
                        PhotoPath = null
                    },
                    new User
                    {
                        Id = 2,
                        FirstName = "Priya",
                        LastName = "Patel",
                        Gender = "Female",
                        Email = "priya.patel@example.com",
                        MobileNo = "9123456780",
                        DateOfBirth = new DateTime(1998, 3, 22),
                        City = "Mumbai",
                        ProfessionalSkills = "Communication,Critical Thinking,Initiative",
                        PhotoPath = null
                    }
                );
            });
        }
    }

    /// <summary>
    /// Helper to auto-apply migrations and ensure DB exists at startup
    /// </summary>
    public static class DbInitializer
    {
        public static void Initialize(AppDbContext context)
        {
            // Applies any pending migrations and creates DB if it doesn't exist
            context.Database.Migrate();
        }
    }
}
