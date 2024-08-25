using ProyectoFinal.LogErrores;
using System.Text;
using System.Text.Json;

namespace ProyectoFinal.Models
{
    public class ErrorLogger
    {
        private readonly IHttpClientFactory _httpClientFactory;

        public ErrorLogger(IHttpClientFactory httpClientFactory)
        {
            _httpClientFactory = httpClientFactory;
        }

        public async Task LogErrorAsync(string errorMessage)
        {
            var logErrorDto = new LogErrorDto { Error = errorMessage };

            var jsonContent = new StringContent(JsonSerializer.Serialize(logErrorDto), Encoding.UTF8, "application/json");

            var client = _httpClientFactory.CreateClient();

            //await client.PostAsync("https://latrilladarestaurante.azurewebsites.net/api/log/error", jsonContent);
            await client.PostAsync("https://localhost:7010/api/log/error", jsonContent);
        }
            
    }
}
