using EM.API.Models;
using EM.API.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace EM.API.Repositories
{   
 public class UserRepository : Repository<User>, IUserRepository, IRepository<User>
 {
    public UserRepository(MarketplaceDbContext context) : base(context) { }  

     public async Task<User?> GetUserByAuth0IdAsync(string auth0Id)
     {
         return await _context.Set<User>().FirstOrDefaultAsync(x => x.Auth0_Id == auth0Id);
     }
    public async Task<bool> DeactivateAsync(int userId)
     {
         var user = _context.Set<User>().FirstOrDefault(x => x.User_Id == userId);
         if (user != null)
         {
             user.IsActive = false;
             _context.Set<User>().Update(user);
             await _context.SaveChangesAsync();
            return true;
         }
         else
         {
             return false;
         }
     }
     public async Task<bool> ActivateAsync(int userId)
     {
         var user = _context.Set<User>().FirstOrDefault(x => x.User_Id == userId);
         if (user != null)
         {
             user.IsActive = true;
             _context.Set<User>().Update(user);
             await _context.SaveChangesAsync();
            return true;
         }
         else
         {
             return false;
         }
     }
    public async Task<User?> LoginUserAsync(string username, string password)
     {
         var user = _context.Set<User>().FirstOrDefault(x => x.Username == username);
         if (user != null)
         {
             _context.Set<User>().Update(user);
             await _context.SaveChangesAsync();
             return user;
         }
         else
         {
             return null;
         }
    }
    }   
}