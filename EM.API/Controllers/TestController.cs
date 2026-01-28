using Microsoft.AspNetCore.Mvc;

namespace EM.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TestController : ControllerBase
    {
        [HttpGet("hello")]
        public IActionResult Hello()
        {
            return Ok(new { message = "Hello from .NET Backend!" });
        }
    }
}