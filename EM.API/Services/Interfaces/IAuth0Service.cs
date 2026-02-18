using EM.API.Services.DTOs;

namespace EM.API.Services.Interfaces
{
public interface IAuth0Service
{
    Task UpdateAuth0UserAsync(string auth0Id, string email, string username, string role);
    Task<string> CreateAuth0UserAsync(CreateUserDto userDto);
    Task DeleteAuth0UserAsync(string auth0Id);
    Task DeactivateAuth0UserAsync(string auth0Id);
    Task ActivateAuth0UserAsync(string auth0Id);

}
}