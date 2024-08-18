using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Google.Apis.Auth;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Linq;
using System.Threading.Tasks;
using UserService.Models;
using UserService.Services;
using System.IO;

namespace UserService.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly UserManager<IdentityUser> _userManager;
        private readonly SignInManager<IdentityUser> _signInManager;
        private readonly TokenService _tokenService;
        private readonly ApplicationSettings _applicationSettings;
        private readonly IConfiguration _configuration; // Inject IConfiguration to access configuration

        public AuthController(
            UserManager<IdentityUser> userManager,
            SignInManager<IdentityUser> signInManager,
            TokenService tokenService,
            IOptions<ApplicationSettings> applicationSettings,
            IConfiguration configuration) // Ensure the constructor parameters are correctly declared
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _tokenService = tokenService;
            _applicationSettings = applicationSettings.Value;
            _configuration = configuration;
        }

        private string GenerateJwtToken(IdentityUser user)
        {
            if (user == null) throw new ArgumentNullException(nameof(user));

            var jwtSecret = _configuration["Jwt:Key"];
            var jwtIssuer = _configuration["Jwt:Issuer"];
            var jwtAudience = _configuration["Jwt:Audience"];
            var jwtExpirationMinutes = int.Parse(_configuration["Jwt:ExpireDays"]) * 1440;

            if (string.IsNullOrWhiteSpace(jwtSecret))
            {
                Console.WriteLine("JWT Secret is null or empty.");
                throw new ArgumentNullException(nameof(jwtSecret), "JWT Secret cannot be null or empty.");
            }

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSecret));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: jwtIssuer,
                audience: jwtAudience,
                claims: new List<Claim>(), // Empty claims for this microservice
                expires: DateTime.Now.AddMinutes(jwtExpirationMinutes),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterModel model)
        {
            if (ModelState.IsValid)
            {
                var user = new IdentityUser
                {
                    UserName = model.Email,
                    Email = model.Email,
                    PhoneNumber = model.PhoneNumber
                };

                var result = await _userManager.CreateAsync(user, model.Password);
                if (result.Succeeded)
                {
                    return Ok(new { status = "Success", message = "User registered successfully" });
                }
                return BadRequest(new { status = "Error", errors = result.Errors.Select(e => e.Description) });
            }
            return BadRequest(ModelState);
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginModel model)
        {
            if (ModelState.IsValid)
            {
                var result = await _signInManager.PasswordSignInAsync(model.Username, model.Password, false, false);
                if (result.Succeeded)
                {
                    var user = await _userManager.FindByNameAsync(model.Username);
                    var token = GenerateJwtToken(user);
                    return Ok(new { token = token });
                }
                return Unauthorized(new { status = "Error", message = "Invalid login attempt." });
            }
            return BadRequest(ModelState);
        }

        [HttpPost("loginWithGoogle")]
        public async Task<IActionResult> LoginWithGoogle([FromBody] GoogleLoginModel model)
        {
            using (var reader = new StreamReader(Request.Body))
            {
                var body = await reader.ReadToEndAsync();
                Console.WriteLine("Raw request body: " + body);
            }

            Console.WriteLine("Model received: " + (model == null ? "null" : "not null"));
            Console.WriteLine("IdToken received: " + model?.IdToken);

            if (model == null || string.IsNullOrWhiteSpace(model.IdToken))
            {
                Console.WriteLine("Invalid Google token received.");
                return BadRequest(new { status = "Error", message = "Invalid Google token." });
            }

            Console.WriteLine("Valid Google token received - here: " + model.IdToken);

            // Check if the Google Client ID is correctly set
            if (string.IsNullOrWhiteSpace(_applicationSettings.GoogleClientId))
            {
                Console.WriteLine("Google Client ID is not configured correctly.");
                return StatusCode(500, new { status = "Error", message = "Google Client ID is missing or invalid in the application settings." });
            }

            var settings = new GoogleJsonWebSignature.ValidationSettings()
            {
                Audience = new List<string> { _applicationSettings.GoogleClientId }
            };


            Console.WriteLine("GoogleJsonWebSignature.ValidationSettings:");
            if (settings.Audience != null && settings.Audience.Any())
            {
                Console.WriteLine($"Audience: {string.Join(", ", settings.Audience)}");
            }
            else
            {
                Console.WriteLine("Audience is null or empty!");
            }

            try
            {
                var payload = await GoogleJsonWebSignature.ValidateAsync(model.IdToken, settings);
                Console.WriteLine("Token validated successfully.");

                // Log the payload details
                Console.WriteLine("GoogleJsonWebSignature.Payload:");
                Console.WriteLine($"Email: {payload.Email}");
                Console.WriteLine($"Name: {payload.Name}");
                Console.WriteLine($"Issuer: {payload.Issuer}");
                Console.WriteLine($"Audience: {string.Join(", ", payload.Audience)}");


                var user = await _userManager.FindByEmailAsync(payload.Email);
                if (user == null)
                {
                    Console.WriteLine("User not found, creating new user.");
                    user = new IdentityUser
                    {
                        UserName = payload.Name,
                        Email = payload.Email
                    };
                    var result = await _userManager.CreateAsync(user);
                    if (!result.Succeeded)
                    {
                        return BadRequest(new { status = "Error", message = "Failed to create user." });
                    }
                    else
                    {
                        Console.WriteLine("User created successfully.");
                    }
                }
                else
                {
                    Console.WriteLine("User found: " + user.Email);
                }
                Console.WriteLine($"User Details: Id={user.Id}, UserName={user.UserName}, Email={user.Email}");

                try
                {
                    var token = GenerateJwtToken(user);
                    Console.WriteLine("JWT Token generated successfully.");
                    return Ok(new { token = token });
                }
                catch (Exception ex)
                {
                    return StatusCode(500, new { status = "Error", message = "An error occurred while generating the token." });
                }
            }
            catch (InvalidJwtException)
            {
                Console.WriteLine("Invalid Google token.");
                return Unauthorized(new { status = "Error", message = "Invalid Google token." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { status = "Error", message = "An error occurred while validating the token." });
            }
        }
    }
}
