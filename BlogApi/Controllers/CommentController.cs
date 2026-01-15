using BlogApi.DTOs;
using BlogApi.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace BlogApi.Controllers;

[ApiController]
[Route("api/comments")]
public class CommentController : ControllerBase
{
    private readonly CommentService _service;

    public CommentController (CommentService service)
    {
        _service = service;
    }

    [Authorize]
    [HttpPost("{postId}")]
    public async Task<IActionResult> AddComment(string postId, CommentDto dto)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var username = User.FindFirstValue(ClaimTypes.Name);

        if (userId == null || username == null)
            return Unauthorized();

        await _service.AddCommentAsync(
            postId,
            userId,
            username,
            dto.Content
        );

        return Ok();
    }

    [HttpGet("by-post/{postId}")]
    public async Task<IActionResult> GetByPostId(string postId)
    {
        var comments = await _service.GetByPostIdAsync(postId);
        return Ok(comments);
    }

    [HttpGet("by-id/{commentId}")]
    public async Task<IActionResult> GetById(string commentId)
    {
        var comment = await _service.GetByCommentIdAsync(commentId);
        if (comment == null) return NotFound();
        return Ok(comment);
    }

    [Authorize]
    [HttpGet("mine")]
    public async Task<IActionResult> MyComments()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == null) return Unauthorized();

        var comments = await _service.GetByAuthorIdAsync(userId);
        return Ok(comments);
    }

    [Authorize]
    [HttpPut("{commentId}")]
    public async Task<IActionResult> Update(
        string commentId,
        [FromBody] UpdateCommentDto dto
    )
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        var updated = await _service.UpdateCommentAsync(
            commentId,
            userId!,
            dto.Content
        );

        if (!updated)
            return Forbid();

        return NoContent();
    }
    
    [Authorize]
    [HttpDelete("{commentId}")]
    public async Task<IActionResult> Delete(string commentId)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == null) return Unauthorized();

        try
        {
            var ok = await _service.DeleteCommentAsync(commentId, userId);
            if (!ok) return NotFound();
            return NoContent();
        }
        catch (UnauthorizedAccessException)
        {
            return Forbid();
        }
    }
}