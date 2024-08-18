using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;


namespace UserService.Models
{
    public class UserService:IdentityUser
    {
        public string firstName { get; set; }
        public string lastName { get; set; }
        public string Department { get; set; }
    }
}