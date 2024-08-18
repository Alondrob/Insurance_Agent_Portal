using Microsoft.AspNetCore.Mvc;
using ClaimsManagementService.Data;
using ClaimsManagementService.Models;
using System;
using System.Linq;

namespace ClaimsManagementService.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ClaimsController : ControllerBase
    {
        private readonly ClaimsContext _context;

        public ClaimsController(ClaimsContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IActionResult GetClaims()
        {
            Console.WriteLine("GetClaims endpoint hit");

            var claims = _context.Claims.ToList();
            return Ok(claims);
        }

        [HttpGet("{id:int}")]
        public IActionResult GetClaim(int id)
        {
            Console.WriteLine($"GetClaim endpoint hit with id: {id}");

            var claim = _context.Claims.Find(id);
            if (claim == null)
            {
                return NotFound();
            }
            return Ok(claim);
        }

        [HttpPost]
        public IActionResult CreateClaim([FromBody] Claim claim)
        {
            Console.WriteLine("CreateClaim endpoint hit");

            if (claim == null)
            {
                return BadRequest("Claim data is null");
            }

            if(!ModelState.IsValid){
                return BadRequest(ModelState);
            }

            _context.Claims.Add(claim);
            _context.SaveChanges();

            return CreatedAtAction(nameof(GetClaim), new { id = claim.Id }, claim);
        }

        [HttpPut("{id:int}")]
        public IActionResult UpdateClaim(int id, [FromBody] Claim updatedClaim)
        {
            if (updatedClaim == null || updatedClaim.Id != id)
            {
                return BadRequest("Claim ID mismatch");

            }

            if(!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var claim = _context.Claims.Find(id);
            if (claim == null)
            {
                return NotFound();
            }

            claim.PolicyNumber = updatedClaim.PolicyNumber;
            claim.DateOfLoss = updatedClaim.DateOfLoss;
            claim.CauseOfLoss = updatedClaim.CauseOfLoss;
            claim.ClaimAmount = updatedClaim.ClaimAmount;
            claim.Status = updatedClaim.Status;
            claim.ClaimType = updatedClaim.ClaimType;

            _context.Claims.Update(claim);
            _context.SaveChanges();

            return NoContent();
        }

        [HttpDelete("{id:int}")]
        public IActionResult DeleteClaim(int id)
        {
            var claim = _context.Claims.Find(id);
            if (claim == null)
            {
                return NotFound();
            }

            _context.Claims.Remove(claim);
            _context.SaveChanges();

            return NoContent();
        }
    }

    [ApiController]
    [Route("api/test")]
    public class TestController : ControllerBase
    {
        private readonly ClaimsContext _context;

        public TestController(ClaimsContext context)
        {
            _context = context;
        }

        [HttpGet("connection")]
        public IActionResult TestDatabaseConnection()
        {
            try
            {
                var canConnect = _context.Database.CanConnect();
                if (canConnect)
                {
                    return Ok("Connection to the database is successful!");
                }
                else
                {
                    return StatusCode(500, "Failed to connect to the database.");
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
    }
}
