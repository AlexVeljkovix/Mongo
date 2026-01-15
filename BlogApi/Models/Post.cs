using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace BlogApi.Models;

public class Post{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id {get; set;}

    public string? Title {get; set;}
    public string? Content {get; set;}

    public List<string> Tags {get; set;} = new();

    public int CommentsCount {get; set;} = 0;
    
    public DateTime CreatedAt {get; set;} = DateTime.UtcNow;

    public DateTime? UpdatedAt {get; set;}
    public string? AuthorId { get; set; } 
    public string? AuthorUsername { get; set; }
}