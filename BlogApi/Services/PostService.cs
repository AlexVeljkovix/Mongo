using BlogApi.Models;
using BlogApi.Repos;
using BlogApi.DTOs;
using System.Security.Claims;

namespace BlogApi.Services;

public class PostService{
    
    private readonly PostRepo _posts;
    private readonly CommentRepo _comments;
    private readonly IHttpContextAccessor _httpContextAccessor;

    public PostService (PostRepo posts, CommentRepo comments, IHttpContextAccessor httpContextAccessor, UserRepo users){
        _posts = posts;
        _comments = comments;
        _httpContextAccessor = httpContextAccessor;
    }

    public async Task<Post> CreateAsync(PostDto dto)
    {
        var user = _httpContextAccessor.HttpContext?.User;

        var userId = user?.FindFirstValue(ClaimTypes.NameIdentifier);
        var username = user?.FindFirstValue(ClaimTypes.Name);

        if (userId == null || username == null)
            throw new UnauthorizedAccessException();

        var post = new Post
        {
            Title = dto.Title!,
            Content = dto.Content!,
            Tags = dto.Tags ?? new List<string>(),

            AuthorId = userId,
            AuthorUsername = username ?? "Anonymous",

            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        await _posts.CreateAsync(post);
        return post;
    }

    public Task<List<Post>> GetAllAsync()
        => _posts.GetAllAsync();


    public Task<List<Post>> GetByKeywordAsync(string keyword)
        => _posts.GetByKeywordAsync(keyword);


    public async Task<Post?> GetByIdAsync(string id)
    {
        return await _posts.GetByIdAsync(id);
    }    

    public async Task<List<Post>> GetByAuthorAsync(string authorId)
    {
        return await _posts.GetByAuthorAsync(authorId);
    }

    public async Task UpdatePostAsync(
        string postId,
        UpdatePostDto dto,
        string userId
    )
    {
        var post = await _posts.GetByIdAsync(postId);
        if(post == null)
        {
            throw new Exception("Post not found!");
        }
        if(post.AuthorId != userId)
        {
            throw new UnauthorizedAccessException("Not your post!");
        }
        post.Title = dto.Title;
        post.Content = dto.Content;
        post.Tags = dto.Tags;

        await _posts.UpdateAsync(post);
    }

    public async Task DeleteAsync(string postId, string userId)
    {
        var post = await _posts.GetByIdAsync(postId);

        if(post == null)
        {
            throw new Exception("Post not found!");
        }

        if(post.AuthorId  != userId)
        {
            throw new UnauthorizedAccessException("Not your post");
        }

        var comments = await _comments.GetCommentsByPostIdAsync(postId);
        foreach(var com in comments)
        {
            await _comments.DeleteAsync(com.Id!);
        }

        await _posts.DeleteAsync(postId);
    }
}