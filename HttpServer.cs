using AuthBackend.Controllers;
using AuthBackend.Utils;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;

namespace AuthBackend
{
    public class HttpServer
    {
        private readonly HttpListener _listener = new();
        private readonly AuthController _auth = new();

        public void Start(string[] prefixes)
        {
            foreach (var p in prefixes) _listener.Prefixes.Add(p);
            _listener.Start();
            Console.WriteLine("Listening on " + string.Join(',', prefixes));
            Task.Run(ProcessLoop);
        }

        private async Task ProcessLoop()
        {
            while (true)
            {
                var ctx = await _listener.GetContextAsync();
                _ = Task.Run(() => Handle(ctx));
            }
        }

        private async void Handle(HttpListenerContext ctx)
        {
            var path = ctx.Request.Url?.AbsolutePath;
            var method = ctx.Request.HttpMethod;
            using var reader = new StreamReader(ctx.Request.InputStream);
            var body = await reader.ReadToEndAsync();
            string response;

            try
            {
                response = path switch
                {
                    "/signup" when method == "POST" => await _auth.SignUp(body),
                    "/signin" when method == "POST" => await _auth.SignIn(body),
                    _ => JsonHelper.WrapError(404, "Not Found")
                };
            }
            catch (Exception ex)
            {
                response = JsonHelper.WrapError(500, "Server error: " + ex.Message);
            }

            var bytes = Encoding.UTF8.GetBytes(response);
            ctx.Response.ContentType = "application/json";
            ctx.Response.ContentLength64 = bytes.Length;
            await ctx.Response.OutputStream.WriteAsync(bytes, 0, bytes.Length);
            ctx.Response.Close();
        }
    }
}
