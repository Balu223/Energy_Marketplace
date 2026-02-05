namespace EM.API.Controllers
{
    using EM.API.Models;
    using EM.API.Repositories.Interfaces;
    using EM.API.Services.DTOs;
    using Microsoft.AspNetCore.Mvc;

    [ApiController]
    [Route("api/admin/")] //lehet hogy nem kell a / ide ha elbasztam akkor majd javítom, csak emlékezzek erre
    public class AdminUserController : ControllerBase
    {
        private readonly IRepository<User> _userRepository;

        public AdminUserController(IRepository<User> userRepository)
        {
            _userRepository = userRepository;
        }

        // Implement CRUD operations for User management here
    }
}