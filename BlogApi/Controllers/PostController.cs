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
    [HttpGet("test-auth")]
    public IActionResult TestAuth()
    {
        var user = HttpContext.User;
        
        var claims = user.Claims.Select(c => new 
        { 
            Type = c.Type, 
            Value = c.Value,
            IsNameIdentifier = c.Type == ClaimTypes.NameIdentifier,
            IsName = c.Type == ClaimTypes.Name
        }).ToList();
        
        return Ok(new
        {
            IsAuthenticated = user.Identity?.IsAuthenticated,
            UserId = user.FindFirst(ClaimTypes.NameIdentifier)?.Value,
            Username = user.FindFirst(ClaimTypes.Name)?.Value,
            AllNameIdentifiers = user.FindAll(ClaimTypes.NameIdentifier).Select(c => c.Value).ToList(),
            Claims = claims
        });
    }

    [Authorize]
    [HttpGet("debug/user")]
    public IActionResult DebugUser()
    {
        var user = HttpContext.User;
        
        var claims = user.Claims.Select(c => new { c.Type, c.Value }).ToList();
        
        return Ok(new
        {
            IsAuthenticated = user.Identity?.IsAuthenticated,
            UserId = user.FindFirst(ClaimTypes.NameIdentifier)?.Value,
            Username = user.FindFirst(ClaimTypes.Name)?.Value,
            Claims = claims
        });
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
        =>Ok (await _service.GetAllAsync());
        

    [HttpGet("mine")]
    public async Task<IActionResult> MyPosts()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var posts = await _service.GetByAuthorAsync(userId!);
        return Ok(posts);
    }

    [Authorize]
    [HttpPost]
    public async Task<IActionResult> Create(PostDto dto)
    {
        var post = await _service.CreateAsync(dto);
        return StatusCode(201, post);
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