using BlogApi.Models;
using BlogApi.Repos;

namespace BlogApi.Services;

public class CommentService
{
    private readonly CommentRepo _comments;
    private readonly PostRepo _posts;

    public CommentService(
        CommentRepo comments,
        PostRepo posts
    )
    {
        _comments = comments;
        _posts = posts;
    }

    public async Task AddCommentAsync(
        string postId,
        string userId,
        string username,
        string content
    )
    {
        var post = await _posts.GetByIdAsync(postId);
        if (post == null)
            throw new Exception("Post not found");

        var comment = new Comment
        {
            PostId = postId,
            PostTitle = post.Title!,
            Content = content,
            AuthorId = userId,
            AuthorUsername = username,
            CreatedAt = DateTime.UtcNow
        };

        await _comments.CreateAsync( comment);
        await _posts.IncrementCommentsCount(postId, 1);
    }

    public Task<List<Comment>> GetByPostIdAsync(string postId)
        => _comments.GetCommentsByPostIdAsync(postId);

    public Task<List<Comment>> GetByAuthorIdAsync(string authorId) 
        => _comments.GetCommentsByAuthorIdAsync(authorId);

    public Task<Comment?> GetByCommentIdAsync(string commentId) 
        => _comments.GetByIdAsync(commentId);

    public async Task<bool> UpdateCommentAsync(
        string commentId,
        string userId,
        string content
    )
    {
        var comment = await _comments.GetByIdAsync(commentId);
        if (comment == null) return false;

        if (comment.AuthorId != userId)
            throw new UnauthorizedAccessException();

        return await _comments.UpdateCommentAsync(commentId, content);
    }

    public async Task<bool> DeleteCommentAsync(
        string commentId,
        string userId
    )
    {
        var comment = await _comments.GetByIdAsync(commentId);
        if (comment == null) return false;

        if (comment.AuthorId != userId)
            throw new UnauthorizedAccessException();

        var deleted = await _comments.DeleteAsync(commentId);
        if (!deleted) return false;

        await _posts.IncrementCommentsCount(comment.PostId!, -1);
        return true;
    }
}