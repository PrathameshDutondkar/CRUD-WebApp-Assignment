using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using UserManagement.Data;
using UserManagement.Models;

namespace UserManagement.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Produces("application/json")]
    public class UsersController : ControllerBase
    {
        private readonly AppDbContext      _db;
        private readonly IWebHostEnvironment _env;
        private readonly ILogger<UsersController> _logger;

        public UsersController(AppDbContext db, IWebHostEnvironment env, ILogger<UsersController> logger)
        {
            _db     = db;
            _env    = env;
            _logger = logger;
        }

        // ─────────────────────────────────────────────────────────────
        // GET /api/users  →  list all users
        // ─────────────────────────────────────────────────────────────
        [HttpGet]
        public async Task<ActionResult<IEnumerable<User>>> GetAll()
        {
            _logger.LogInformation("Fetching all users");
            var users = await _db.Users.AsNoTracking().OrderByDescending(u => u.Id).ToListAsync();
            return Ok(users);
        }

        // ─────────────────────────────────────────────────────────────
        // GET /api/users/{id}  →  single user
        // ─────────────────────────────────────────────────────────────
        [HttpGet("{id:int}")]
        public async Task<ActionResult<User>> GetById(int id)
        {
            var user = await _db.Users.AsNoTracking().FirstOrDefaultAsync(u => u.Id == id);
            if (user is null) return NotFound(new { message = $"User with id {id} not found." });
            return Ok(user);
        }

        // ─────────────────────────────────────────────────────────────
        // POST /api/users  →  create
        // ─────────────────────────────────────────────────────────────
        [HttpPost]
        [Consumes("multipart/form-data")]
        public async Task<ActionResult<User>> Create([FromForm] UserFormDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            // Check duplicate email
            if (await _db.Users.AnyAsync(u => u.Email == dto.Email))
                return Conflict(new { message = "A user with this email already exists." });

            var user = MapDtoToUser(new User(), dto);

            if (dto.Photo is not null)
                user.PhotoPath = await SavePhotoAsync(dto.Photo);

            _db.Users.Add(user);
            await _db.SaveChangesAsync();

            _logger.LogInformation("Created user {Id} — {Name}", user.Id, user.FullName);
            return CreatedAtAction(nameof(GetById), new { id = user.Id }, user);
        }

        // ─────────────────────────────────────────────────────────────
        // PUT /api/users/{id}  →  update
        // ─────────────────────────────────────────────────────────────
        [HttpPut("{id:int}")]
        [Consumes("multipart/form-data")]
        public async Task<ActionResult<User>> Update(int id, [FromForm] UserFormDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var user = await _db.Users.FindAsync(id);
            if (user is null) return NotFound(new { message = $"User with id {id} not found." });

            // Check duplicate email (exclude current user)
            if (await _db.Users.AnyAsync(u => u.Email == dto.Email && u.Id != id))
                return Conflict(new { message = "Another user with this email already exists." });

            MapDtoToUser(user, dto);

            if (dto.Photo is not null)
            {
                DeleteOldPhoto(user.PhotoPath);
                user.PhotoPath = await SavePhotoAsync(dto.Photo);
            }

            _db.Users.Update(user);
            await _db.SaveChangesAsync();

            _logger.LogInformation("Updated user {Id} — {Name}", user.Id, user.FullName);
            return Ok(user);
        }

        // ─────────────────────────────────────────────────────────────
        // DELETE /api/users/{id}  →  delete
        // ─────────────────────────────────────────────────────────────
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var user = await _db.Users.FindAsync(id);
            if (user is null) return NotFound(new { message = $"User with id {id} not found." });

            DeleteOldPhoto(user.PhotoPath);
            _db.Users.Remove(user);
            await _db.SaveChangesAsync();

            _logger.LogInformation("Deleted user {Id}", id);
            return Ok(new { message = "User deleted successfully." });
        }

        // ─────────────────────────────────────────────────────────────
        // Helpers
        // ─────────────────────────────────────────────────────────────
        private static User MapDtoToUser(User user, UserFormDto dto)
        {
            user.FirstName          = dto.FirstName.Trim();
            user.LastName           = dto.LastName.Trim();
            user.Gender             = dto.Gender;
            user.Email              = dto.Email.Trim().ToLower();
            user.MobileNo           = dto.MobileNo.Trim();
            user.DateOfBirth        = dto.DateOfBirth;
            user.City               = dto.City;
            user.ProfessionalSkills = dto.ProfessionalSkills is { Count: > 0 }
                                        ? string.Join(",", dto.ProfessionalSkills)
                                        : string.Empty;
            return user;
        }

        private async Task<string> SavePhotoAsync(IFormFile photo)
        {
            var uploadsDir = Path.Combine(_env.WebRootPath, "uploads");
            Directory.CreateDirectory(uploadsDir);

            var ext      = Path.GetExtension(photo.FileName).ToLowerInvariant();
            var fileName = $"{Guid.NewGuid()}{ext}";
            var filePath = Path.Combine(uploadsDir, fileName);

            await using var stream = new FileStream(filePath, FileMode.Create);
            await photo.CopyToAsync(stream);

            return $"/uploads/{fileName}";
        }

        private void DeleteOldPhoto(string? photoPath)
        {
            if (string.IsNullOrWhiteSpace(photoPath)) return;
            var fullPath = Path.Combine(_env.WebRootPath, photoPath.TrimStart('/'));
            if (System.IO.File.Exists(fullPath))
                System.IO.File.Delete(fullPath);
        }
    }
}
