using AuthBackend.Data;
using AuthBackend.Interface;
using AuthBackend.Models;
using AuthBackend.Utils;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AuthBackend.Services
{
    public class AuthService : IAuthService
    {
        private readonly AppDbContext _db = new();

        public async Task<bool> RegisterAsync(string username, string password)
        {
            if (await _db.Users.AnyAsync(u => u.Username == username))
                return false;

            var hash = PasswordHasher.Hash(password);
            _db.Users.Add(new User { Username = username, PasswordHash = hash });
            await _db.SaveChangesAsync();
            return true;
        }

        public async Task<User?> AuthenticateAsync(string username, string password)
        {
            var user = await _db.Users.FirstOrDefaultAsync(u => u.Username == username);
            if (user == null || !PasswordHasher.Verify(password, user.PasswordHash))
                return null;

            return user;
        }
    }
}
