using System;
using System.ComponentModel.DataAnnotations;

namespace ClaimsManagementService.Models
{
    public class Claim
    {
        public int Id { get; set; }

        [Required]
        [StringLength(50)]
        public string PolicyNumber { get; set; } = string.Empty; // Initialized to an empty string
        
        [Required]
        public DateTime DateOfLoss { get; set; }
        
        [Required]
        [StringLength(350)]
        public string CauseOfLoss { get; set; } = string.Empty; // Initialized to an empty string
        
        [Required]
        [Range(0, double.MaxValue)]
        public decimal ClaimAmount { get; set; }

        [Required]
        [StringLength(20)]
        public string Status { get; set; } = string.Empty; // Initialized to an empty string

        [Required]
        [StringLength(50)]
        public string ClaimType { get; set; } = string.Empty; // Initialized to an empty string
    }
}
