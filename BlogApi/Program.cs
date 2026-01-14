using BlogApi.Repos;
using BlogApi.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.Security.Claims;

var builder = WebApplication.CreateBuilder(args);

//debugiranje
builder.Logging.ClearProviders();
builder.Logging.AddConsole();
builder.Logging.AddDebug();
builder.Logging.SetMinimumLevel(LogLevel.Debug);

//mongo kontekst
builder.Services.AddSingleton<MongoDbContextService>();

//repos
builder.Services.AddScoped<PostRepo>();
builder.Services.AddScoped<CommentRepo>();

// serivis
builder.Services.AddScoped<PostService>();
builder.Services.AddScoped<CommentService>();
builder.Services.AddScoped<UserRepo>();
builder.Services.AddScoped<AuthService>();

//context access
builder.Services.AddHttpContextAccessor();



//kontroleri
builder.Services.AddControllers();

//JWT
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]!)
            ),
            NameClaimType = ClaimTypes.Name,
            RoleClaimType = ClaimTypes.Role
        };
        
        options.Events = new JwtBearerEvents
        {
            OnAuthenticationFailed = context =>
            {
                Console.WriteLine($"=== JWT AUTH FAILED ===");
                Console.WriteLine($"Exception: {context.Exception.Message}");
                Console.WriteLine($"Exception Type: {context.Exception.GetType().Name}");
                
                if (context.Exception is SecurityTokenExpiredException)
                    Console.WriteLine("Token is expired");
                else if (context.Exception is SecurityTokenInvalidSignatureException)
                    Console.WriteLine("Invalid signature");
                else if (context.Exception is SecurityTokenInvalidIssuerException)
                    Console.WriteLine("Invalid issuer");
                    
                Console.WriteLine($"=== END JWT AUTH FAILED ===");
                return Task.CompletedTask;
            },
            OnTokenValidated = context =>
            {
                Console.WriteLine("=== JWT TOKEN VALIDATED ===");
                var user = context.Principal;
                Console.WriteLine($"User authenticated: {user?.Identity?.Name}");
                Console.WriteLine($"=== END JWT TOKEN VALIDATED ===");
                return Task.CompletedTask;
            }
        };
    });

//swagger i open api
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

//CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend",
        policy =>
        {
            policy
                .WithOrigins("http://localhost:5173")
                .AllowAnyHeader()
                .AllowAnyMethod();
        });
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}


app.UseAuthentication();
app.UseAuthorization();
app.UseCors("AllowFrontend");

app.MapControllers();

app.Run();