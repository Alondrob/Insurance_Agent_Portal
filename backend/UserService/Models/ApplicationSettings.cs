public class ApplicationSettings
{
    public string GoogleClientId { get; set; }
    public string GoogleClientSecret { get; set; }
    public string JwtSecret { get; set; }        // Maps to Jwt:Key
    public string JwtIssuer { get; set; }        // Maps to Jwt:Issuer
    public string JwtAudience { get; set; }      // Maps to Jwt:Audience
    public int JwtExpirationMinutes { get; set; } // Can be derived from Jwt:ExpireDays
}
