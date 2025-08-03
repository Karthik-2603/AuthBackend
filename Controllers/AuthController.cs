using AuthBackend.DTOs;
using AuthBackend.Services;
using AuthBackend.Utils;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace AuthBackend.Controllers
{
    public class AuthController
    {
        private readonly AuthService _auth = new();
        private readonly JwtService _jwt = new();

        public async Task HandleRequest(HttpListenerContext context)
        {
            var request = context.Request;
            var response = context.Response;

            if (request.HttpMethod == "OPTIONS")
            {
                AddCorsHeaders(response);
                response.StatusCode = (int)HttpStatusCode.OK;
                response.Close();
                return;
            }

            // requests
            AddCorsHeaders(response);

            string result;

            try
            {
                using var reader = new StreamReader(request.InputStream);
                var body = await reader.ReadToEndAsync();

                if (request.HttpMethod == "POST" && request.Url.AbsolutePath.EndsWith("/signup"))
                {
                    result = await SignUp(body);
                }
                else if (request.HttpMethod == "POST" && request.Url.AbsolutePath.EndsWith("/signin"))
                {
                    result = await SignIn(body);
                }
                else
                {
                    response.StatusCode = (int)HttpStatusCode.NotFound;
                    response.Close();
                    return;
                }
            }
            catch (Exception ex)
            {
                result = JsonHelper.WrapError(500, $"Internal Server Error: {ex.Message}");
            }

            var buffer = Encoding.UTF8.GetBytes(result);
            response.ContentType = "application/json";
            response.ContentEncoding = Encoding.UTF8;
            response.ContentLength64 = buffer.Length;
            await response.OutputStream.WriteAsync(buffer, 0, buffer.Length);
            response.Close();
        }

        // Adding headers
        private void AddCorsHeaders(HttpListenerResponse response)
        {
            response.AddHeader("Access-Control-Allow-Origin", "*");
            response.AddHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
            response.AddHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
        }

        public async Task<string> SignUp(string body)
        {
            var req = JsonSerializer.Deserialize<SignUpRequest>(body);
            if (req == null)
            {
                return JsonHelper.WrapError(400, "Invalid JSON");
            } 

            var success = await _auth.RegisterAsync(req.username, req.password);
            if (!success) 
            {
                return JsonHelper.WrapError(400, "Username already exists");
            } 

            return JsonHelper.WrapResult(new { message = "User registered successfully" });
        }

        public async Task<string> SignIn(string body)
        {
            var req = JsonSerializer.Deserialize<SignInRequest>(body);
            if (req == null) return JsonHelper.WrapError(400, "Invalid JSON");

            var user = await _auth.AuthenticateAsync(req.username, req.password);
            if (user == null) return JsonHelper.WrapError(401, "Invalid credentials Or If you are not signed up please signup");

            var token = _jwt.GenerateToken(user.Username);
            return JsonHelper.WrapResult(new { token });
        }
    }
}
