using BlogApi.Models;
using BlogApi.Services;
using MongoDB.Driver;

namespace BlogApi.Repos;

public class CommentRepo
{
    private readonly IMongoCollection<Comment> _comments;

    public CommentRepo(MongoDbContextService context)
    {
        _comments = context.GetCollection<Comment>("comments");
    }

    public Task CreateAsync(Comment comment)
        =>  _comments.InsertOneAsync(comment);

    public async Task<bool> UpdateCommentAsync(string id, string content)
    {
        var result = await _comments.UpdateOneAsync(
            c => c.Id == id,
            Builders<Comment>.Update.Set(c => c.Content, content).Set(c=>c.UpdatedAt, DateTime.UtcNow)
        );

        return result.MatchedCount > 0;
    }

    public Task<List<Comment>> GetCommentsByPostIdAsync (string postId)
        => _comments.Find( c=> c.PostId == postId).ToListAsync();

    public Task<List<Comment>> GetCommentsByAuthorIdAsync(string authorId)
        => _comments.Find( c=> c.AuthorId == authorId).SortBy(c => c.CreatedAt).ToListAsync();

    public async Task<Comment?> GetByIdAsync(string id)
    {
        return await _comments.Find(c => c.Id == id).FirstOrDefaultAsync();
    }

    public async Task<bool> DeleteAsync(string id)
    {
        var result = await _comments.DeleteOneAsync(c => c.Id == id);
        return result.DeletedCount > 0;
    }

    public Task DeleteByPostIdAsync (string postId)
    {
        return _comments.DeleteManyAsync(c => c.PostId == postId);
    }
}