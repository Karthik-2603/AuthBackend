using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AuthBackend.Utils
{
    public static class JsonHelper
    {
        public static string WrapResult(object payload) =>
            System.Text.Json.JsonSerializer.Serialize(new { message = "ok", data = payload ,status = 200});

        public static string WrapError(int status, string msg) =>
            System.Text.Json.JsonSerializer.Serialize(new { message = "error", error = msg, status });
    }
}
