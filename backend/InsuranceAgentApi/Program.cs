using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();            // Adds support for controllers.
builder.Services.AddEndpointsApiExplorer();   // Required for Swagger.
builder.Services.AddSwaggerGen();             // Adds Swagger generation.
builder.Services.AddAuthorization();

// Uncomment the following lines if you want to use http.sys on Windows
// #pragma warning disable CA1416 // Validate platform compatibility
// builder.WebHost.UseHttpSys(options =>
// {
//     options.UrlPrefixes.Add("http://localhost:5000/insurance-agent");
// });
// #pragma warning restore CA1416 // Validate platform compatibility

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage(); // Provides detailed error responses in development.
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UsePathBase("/insurance-agent"); // Set the path base here

app.UseRouting();

app.UseAuthorization();

app.MapControllers(); // Maps controllers to routes.

app.Run();
