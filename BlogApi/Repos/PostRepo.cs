using BlogApi.Models;
using BlogApi.Services;
using MongoDB.Driver;
using MongoDB.Bson;

namespace BlogApi.Repos;

public class PostRepo{
    private readonly IMongoCollection<Post> _posts;

    public PostRepo(MongoDbContextService context)
    {
        _posts = context.GetCollection<Post>("posts");

        var tagIndex = Builders<Post>.IndexKeys.Ascending(p => p.Tags);
        _posts.Indexes.CreateOne( new CreateIndexModel<Post>(tagIndex));

    }

    public async Task<List<Post>> GetAllAsync()
        => await _posts
            .Find(_ => true)
            .SortByDescending(p=>p.CreatedAt)
            .ToListAsync();

    public async Task<Post> CreateAsync (Post post)
    {
        await _posts.InsertOneAsync(post);
        return post;
    }

    public async Task<List<Post>> GetByKeywordAsync(string keyword)
    {

        var regex = new BsonRegularExpression(keyword, "i");
        
        var filter = Builders<Post>.Filter.Or(
            Builders<Post>.Filter.Regex(p=>p.Title, regex),
            Builders<Post>.Filter.Regex("Tags",regex)
        );

        return await _posts
            .Find(filter)
            .SortByDescending(p => p.CreatedAt)
            .ToListAsync();
    }


    public async Task<Post?> GetByIdAsync(string id)
    {
        return await _posts
            .Find(p => p.Id == id)
            .FirstOrDefaultAsync();
    }


    public async Task<bool> UpdatePostAsync (string id, string title, string content, List<string> tags)
    {
        var update = Builders<Post>.Update
            .Set(p=>p.Title, title)
            .Set(p=>p.Content, content)
            .Set(p=>p.Tags,tags)
            .Set(p=>p.UpdatedAt, DateTime.UtcNow);

        var result = await _posts.UpdateOneAsync(
            p => p.Id == id,
            update
        );

        return result.MatchedCount > 0;
    }

    public async Task IncrementCommentsCount (string postId, int value = 1)
    {
        var filter = Builders<Post>.Filter.Eq(p => p.Id, postId);
        var update = Builders<Post>.Update
            .Inc("CommentsCount", value);

        await _posts.UpdateOneAsync(
            filter, 
            update
        );

    }

    public async Task<bool> DeleteAsync(string id)
    {
        var result = await _posts.DeleteOneAsync(p => p.Id == id);
        return result.DeletedCount > 0;
    }

    public async Task UpdateAsync(Post post)
    => await _posts.ReplaceOneAsync(p => p.Id == post.Id, post);

    public async Task<List<Post>> GetByAuthorAsync(string authorId)
    => await _posts.Find(p => p.AuthorId == authorId).ToListAsync();
}