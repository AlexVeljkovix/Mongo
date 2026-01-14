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
    public Task<User> GetByEmailAsync(string email)
    => _users.Find(u => u.Email == email).FirstOrDefaultAsync();
    public Task<User> GetByIdAsync(string id) 
    => _users.Find(u => u.Id == id).FirstOrDefaultAsync();

    public Task CreateAsync(User user)
    => _users.InsertOneAsync(user);
}