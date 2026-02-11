using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using EM.API.Models;
using EM.API.Services.DTOs;

namespace EM.API.Services.Interfaces
{
    public interface IAdminService
    {
        Task<IEnumerable<UserResponseDto>> GetAllUsersAsync();
    }
}