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
        private readonly IConfiguration _configuration;

        public AuthController(
            UserManager<IdentityUser> userManager,
            SignInManager<IdentityUser> signInManager,
            TokenService tokenService,
            IConfiguration configuration)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _tokenService = tokenService;
            _configuration = configuration;
        }

        private string GenerateJwtToken(IdentityUser user)
        {
            Console.WriteLine("Generating JWT token...");
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
                claims: new List<Claim>(),
                expires: DateTime.Now.AddMinutes(jwtExpirationMinutes),
                signingCredentials: creds
            );

            Console.WriteLine("JWT token generated successfully.");
            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        [HttpPost("loginWithGoogle")]
        public async Task<IActionResult> LoginWithGoogle([FromBody] GoogleLoginModel model)
        {
            Console.WriteLine("LoginWithGoogle called...");

            if (model == null || string.IsNullOrWhiteSpace(model.IdToken))
            {
                Console.WriteLine("Invalid Google token received.");
                return BadRequest(new { status = "Error", message = "Invalid Google token." });
            }

            Console.WriteLine("Valid Google token received - IdToken: " + model.IdToken);

            var settings = new GoogleJsonWebSignature.ValidationSettings()
            {
                Audience = new List<string> { _configuration["ApplicationSettings:GoogleClientId"] }
            };

            try
            {
                var payload = await GoogleJsonWebSignature.ValidateAsync(model.IdToken, settings);
                Console.WriteLine("Token validated successfully. Payload details:");
                Console.WriteLine($"Email: {payload.Email}");
                Console.WriteLine($"Name: {payload.Name}");
                Console.WriteLine($"Issuer: {payload.Issuer}");

                var user = await _userManager.FindByEmailAsync(payload.Email);
                if (user == null)
                {
                    Console.WriteLine("User not found, creating new user...");
                    user = new IdentityUser
                    {
                        UserName = payload.Name,
                        Email = payload.Email
                    };
                    var result = await _userManager.CreateAsync(user);
                    if (!result.Succeeded)
                    {
                        Console.WriteLine("Failed to create user.");
                        return BadRequest(new { status = "Error", message = "Failed to create user." });
                    }
                    Console.WriteLine("User created successfully.");
                }
                else
                {
                    Console.WriteLine("User found: " + user.Email);
                }

                var token = GenerateJwtToken(user);
                Console.WriteLine("JWT Token generated successfully.");
                return Ok(new { token = token });
            }
            catch (InvalidJwtException)
            {
                Console.WriteLine("Invalid Google token.");
                return Unauthorized(new { status = "Error", message = "Invalid Google token." });
            }
            catch (Exception ex)
            {
                Console.WriteLine("An error occurred while validating the token: " + ex.Message);
                return StatusCode(500, new { status = "Error", message = "An error occurred while validating the token." });
            }
        }
    }
}
