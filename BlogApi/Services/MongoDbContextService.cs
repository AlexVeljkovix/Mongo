using MongoDB.Driver;

namespace BlogApi.Services;

public class MongoDbContextService{
    private readonly IMongoDatabase _database;

    public MongoDbContextService(IConfiguration configuration){
        var client = new MongoClient(
            configuration["MongoDb:ConnectionString"]
        );
        _database = client.GetDatabase(
            configuration["MongoDb:DatabaseName"]
        );
    }

    public IMongoCollection<T> GetCollection<T>(string collectionName)
        => _database.GetCollection<T>(collectionName);
}