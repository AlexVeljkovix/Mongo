using BlogApi.DTOs;
using BlogApi.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace BlogApi.Controllers;

[ApiController]
[Route("api/posts")]
public class PostController : ControllerBase{

    private readonly PostService _service;

    public PostController (PostService service){
        _service = service;
    }

    [Authorize]
    [HttpPost]
    public async Task<IActionResult> Create(PostDto dto)
    {
        var post = await _service.CreateAsync(dto);
        return StatusCode(201, post);
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
        =>Ok (await _service.GetAllAsync());
        
    [Authorize]
    [HttpGet("mine")]
    public async Task<IActionResult> MyPosts()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var posts = await _service.GetByAuthorAsync(userId!);
        return Ok(posts);
    }

    [HttpGet("by-keyword/{keyword}")]
    public async Task<IActionResult> GetByKeyword(string keyword)
        =>Ok(await _service.GetByKeywordAsync(keyword));


    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(string id)
    {
        var post = await _service.GetByIdAsync(id);
        if(post == null)
            return NotFound();
        return Ok(post);
    }

    [Authorize]
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdatePost(
        string id,
        UpdatePostDto dto)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        
        await _service.UpdatePostAsync(id, dto, userId!);
        return NoContent();

    }

    [Authorize]
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        await _service.DeleteAsync(id, userId!);
        return Ok();
    }
}