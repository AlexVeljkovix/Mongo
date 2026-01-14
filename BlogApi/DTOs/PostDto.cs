namespace BlogApi.DTOs;

public class PostDto{

    public string Title { get; set; } = null!;
    public string? Content { get; set; } = null!;
    public List<string> Tags { get; set; } = new();
}