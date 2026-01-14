namespace BlogApi.DTOs;
public class PostResponseDto
{
    public string Id { get; set; } = null!;
    public string Title { get; set; } = null!;
    public string Content { get; set; } = null!;
    public List<string> Tags { get; set; } = new();
    public string AuthorUsername { get; set; } = null!;
    public DateTime CreatedAt { get; set; }
}
