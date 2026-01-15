using BlogApi.Models;
using BlogApi.Services;
using MongoDB.Driver;

namespace BlogApi.Repos;
public class UserRepo
{
    private readonly IMongoCollection<User> _users;

    public UserRepo(MongoDbContextService context)
    {
        _users = context.GetCollection<User>("users");
    }
    public async Task<User> GetByEmailAsync(string email)
    => await _users.Find(u => u.Email == email).FirstOrDefaultAsync();
    public async Task<User> GetByIdAsync(string id) 
    => await _users.Find(u => u.Id == id).FirstOrDefaultAsync();

    public async Task CreateAsync(User user)
    => await _users.InsertOneAsync(user);
}