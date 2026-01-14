using System.Security.Claims;
using BlogApi.DTOs;
using BlogApi.Models;
using BlogApi.Repos;
using System.IdentityModel.Tokens.Jwt;
using System.Text;
using Microsoft.IdentityModel.Tokens;



namespace BlogApi.Services;

public class AuthService
{
    private readonly UserRepo _users;
    private readonly IConfiguration _config;

    public AuthService(UserRepo users, IConfiguration config)
    {
        _users = users;
        _config = config;
    }
    public async Task RegisterAsync(RegisterDto dto)
    {
        var existing = await _users.GetByEmailAsync(dto.Email!);
        if (existing != null)
            throw new InvalidOperationException("Email already in use");

        var hash = BCrypt.Net.BCrypt.HashPassword(dto.Password);

        var user = new User
        {
            Username = dto.Username,
            Email = dto.Email,
            PasswordHash = hash
        };

    await _users.CreateAsync(user);

    }

    public async Task<LoginResponseDto> LoginAsync(LoginDto dto)
    {
        var user = await _users.GetByEmailAsync(dto.Email!);
        if(user == null)
        {
            throw new UnauthorizedAccessException("Invalid email!");
        }
        var validPassword = BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash);
        if(!validPassword)
        {
            throw new UnauthorizedAccessException("Invalid password!");
        }
        var token = GenerateJwt(user);
        return new LoginResponseDto
        {
            Token = token,
            User = new UserDto
            {
                Id = user.Id,
                Username = user.Username,
                Email = user.Email
            }
        };

    }

    public string GenerateJwt(User user)
    {
        var claims = new[]
        {
            new Claim(JwtRegisteredClaimNames.Sub, user.Id!),
            new Claim(JwtRegisteredClaimNames.Name, user.Username!),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            new Claim(ClaimTypes.NameIdentifier, user.Id!),
            new Claim(ClaimTypes.Name, user.Username!)
        };
        
        var key = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(_config["Jwt:Key"]!)
        );
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer: _config["Jwt:Issuer"],
            audience: _config["Jwt:Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddDays(30),
            signingCredentials: creds
        );
        
        return new JwtSecurityTokenHandler().WriteToken(token);
    }

}