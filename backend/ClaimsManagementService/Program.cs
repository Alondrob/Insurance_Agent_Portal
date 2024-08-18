using ClaimsManagementService.Data;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddDbContext<ClaimsContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("ClaimsDatabase")));
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddAuthorization();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UsePathBase("/claims-mgmt"); // Set the path base here

app.UseRouting();

app.UseAuthorization();

app.MapControllers();

app.Run();
