using Auth0.ManagementApi;
using Auth0.ManagementApi.Models;
using EM.API.Services.DTOs;
using EM.API.Services.Interfaces;
using System.ComponentModel;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Text.Json;

namespace EM.API.Services
{
public class Auth0Service : IAuth0Service
{
    private readonly HttpClient _http;
    private readonly string _domain;
    private readonly string _clientId;
    private readonly string _clientSecret;

    public Auth0Service(IHttpClientFactory httpClientFactory, IConfiguration config)
    {
        _http = httpClientFactory.CreateClient();
        _domain = config["Auth0:Domain"]!;
        _clientId = config["Auth0:EM_M2MClientId"]!;
        _clientSecret = config["Auth0:EM_M2MClientSecret"]!;
    }

    private async Task<string> GetManagementTokenAsync()
    {
        var body = new
        {
            client_id = _clientId,
            client_secret = _clientSecret,
            audience = $"https://{_domain}/api/v2/",
            grant_type = "client_credentials"

        };
        var resp = await _http.PostAsJsonAsync($"https://{_domain}/oauth/token", body);
        resp.EnsureSuccessStatusCode();
        var json = await resp.Content.ReadFromJsonAsync<JsonElement>();
        return json.GetProperty("access_token").GetString()!;
    }

public async Task UpdateAuth0UserAsync(string auth0UserId, string? email, string? username, string? role)
{
    var token = await GetManagementTokenAsync();

    var request = new
    {
        username = username,
        // szerepkör menjen app_metadata-ba (vagy user_metadata-ba)
        app_metadata = new
        {
            role = role
        }
    };

    var req = new HttpRequestMessage(
        HttpMethod.Patch,
        $"https://{_domain}/api/v2/users/{Uri.EscapeDataString(auth0UserId)}")
    {
        Content = JsonContent.Create(request)
    };

    req.Headers.Authorization = new AuthenticationHeaderValue("Bearer", token);

    var resp = await _http.SendAsync(req);

    // ← EZ az új rész: hiba kiírása
    var content = await resp.Content.ReadAsStringAsync();
    Console.WriteLine($"Auth0 user update response: {resp.StatusCode} {content}");

    resp.EnsureSuccessStatusCode();
    }

    public async Task<string> CreateAuth0UserAsync(CreateUserDto userDto)
    {
        var token = await GetManagementTokenAsync();

        var body = new
        {
            connection = "Username-Password-Authentication",
            email = userDto.Email,
            password = userDto.Password,
            username = userDto.Username,
            email_verified = false,
            verify_email = true,
            app_metadata = new
            {
                role = userDto.Role
            }

        };
        var req = new HttpRequestMessage(
            HttpMethod.Post,
            $"https://{_domain}/api/v2/users")
            {
                Content = JsonContent.Create(body)
            };

        req.Headers.Authorization = new AuthenticationHeaderValue("Bearer", token);
            var resp = await _http.SendAsync(req);
        var content = await resp.Content.ReadAsStringAsync();
        Console.WriteLine($"Auth0 create user: {resp.StatusCode} {content}");
        resp.EnsureSuccessStatusCode();
        using var doc = JsonDocument.Parse(content);
        var auth0UserId = doc.RootElement.GetProperty("user_id").GetString();
        return auth0UserId!;
    }
    
    }
}