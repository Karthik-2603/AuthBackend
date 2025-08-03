using AuthBackend.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AuthBackend.Interface
{
    public interface IAuthService
    {
        Task<bool> RegisterAsync(string username, string password);
        Task<User?> AuthenticateAsync(string username, string password);
    }
}
