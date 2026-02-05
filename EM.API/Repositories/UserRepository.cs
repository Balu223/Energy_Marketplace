using EM.API.Models;
using EM.API.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace EM.API.Repositories
{   
 public class UserRepository : Repository<User>, IUserRepository
 {
    public UserRepository(MarketplaceDbContext context) : base(context) { }  
 
     public async Task<User?> GetUserById(int userId)
     {
         return await _context.Set<User>().FirstOrDefaultAsync(x => x.User_Id == userId);
     }

     public async Task<User?> GetUserByAuth0IdAsync(string auth0Id)
     {
         return await _context.Set<User>().FirstOrDefaultAsync(x => x.Auth0_Id == auth0Id);
     }
 
     public async Task<IReadOnlyList<User>> GetAllUsersAsync()
     {
         return await _context.Set<User>().ToListAsync();
     }
 
     public async Task<User?> CreateUserAsync(User user)
     {
         await _context.Set<User>().AddAsync(user);
         await _context.SaveChangesAsync();
         return user;
     }
 
     public async Task<User?> UpdateUserAsync(int userId, User user)
     {
         var existingUser = _context.Set<User>().FirstOrDefault(x => x.User_Id == userId);
         if (existingUser != null)
         {
             _context.Entry(existingUser).CurrentValues.SetValues(user);
             await _context.SaveChangesAsync();
             return user;
         }
            else
            {
                return null;
            }
     }
 
     public async Task<bool> DeleteUserAsync(int userId)
     {
         var user = _context.Set<User>().FirstOrDefault(x => x.User_Id == userId);
         if (user != null)
         {
             _context.Set<User>().Remove(user);
             await _context.SaveChangesAsync();
             return true;
         }
         else
         {
             return false;
         }
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