using AuthBackend;
using AuthBackend.Controllers;
using AuthBackend.Data;
using System.Net;

using var db = new AppDbContext();
db.Database.EnsureCreated();
var listener = new HttpListener();
listener.Prefixes.Add("http://localhost:5000/");
listener.Start();
Console.WriteLine("Server started at http://localhost:5000");

var controller = new AuthController();

while (true)
{
    var context = listener.GetContext();
    _ = Task.Run(() => controller.HandleRequest(context)); // async-safe
}
