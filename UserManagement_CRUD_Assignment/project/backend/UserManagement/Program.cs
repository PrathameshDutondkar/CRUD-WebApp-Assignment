using Microsoft.EntityFrameworkCore;
using UserManagement.Data;

var builder = WebApplication.CreateBuilder(args);

// ── Services ──────────────────────────────────────────────────────────
builder.Services.AddControllers();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new() { Title = "User Management API", Version = "v1" });
});

// ── SQL Server via Entity Framework Core ──────────────────────────────
builder.Services.AddDbContext<AppDbContext>(options =>
{
    options.UseSqlServer(
        builder.Configuration.GetConnectionString("DefaultConnection"),
        sqlOptions =>
        {
            sqlOptions.EnableRetryOnFailure(
                maxRetryCount: 5,
                maxRetryDelay: TimeSpan.FromSeconds(10),
                errorNumbersToAdd: null
            );
        }
    );

    if (builder.Environment.IsDevelopment())
        options.EnableSensitiveDataLogging();
});

// ── CORS — allow React dev servers ────────────────────────────────────
builder.Services.AddCors(options =>
{
    options.AddPolicy("ReactPolicy", policy =>
    {
        policy
            .WithOrigins(
                "http://localhost:3000",   // CRA
                "http://localhost:5173"    // Vite
            )
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
    });
});

var app = builder.Build();

// ── Auto-migrate + seed on startup ────────────────────────────────────
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    try
    {
        DbInitializer.Initialize(db);
        app.Logger.LogInformation("✅ Database migrated and ready.");
    }
    catch (Exception ex)
    {
        app.Logger.LogError(ex, "❌ Database migration failed. Check your connection string.");
    }
}

// ── Middleware pipeline ───────────────────────────────────────────────
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "User Management API v1");
        c.RoutePrefix = "swagger";
    });
}

app.UseStaticFiles();   // serve /wwwroot/uploads/...
app.UseCors("ReactPolicy");
app.UseAuthorization();
app.MapControllers();

app.Logger.LogInformation("🚀 API running → http://localhost:5000");
app.Logger.LogInformation("📖 Swagger UI → http://localhost:5000/swagger");

app.Run();
