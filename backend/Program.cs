// dotnet ef migrations add MigrationTitle
// dotnet ef database update
using Stripe;
using Uplay;

StripeConfiguration.ApiKey = "sk_test_51NnHKDLBQ2JqxfdO9AWFvR1J8IwPokQ9lhQ7Ngbkj8B23l6eYCHWJaztXUw47gQAHiZqz8AXriG2gjt9p6GJdKx9006dwBxhRS";

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddControllers();
builder.Services.AddDbContext<Database>();
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.WithOrigins(builder.Configuration.GetSection("AllowedOrigins").Get<string[]>()!)
            .AllowAnyMethod()
            .AllowAnyHeader();
    });
});

builder.Services.AddSwaggerGen();

var app = builder.Build();

app.UseRouting();
app.MapControllers();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseCors();
app.Run();