using Microsoft.AspNetCore.Mvc;

namespace ProyectoFinal.LogErrores
{
    [ApiController]
    [Route("api/log")]
    public class LogErroresController : ControllerBase
    {
        [HttpPost("error")]
        public async Task<IActionResult> LogClientError([FromBody] LogErrorDto logError)
        {
            try
            {
                string logDirectory = Path.Combine(Directory.GetCurrentDirectory(), "Logs", DateTime.Now.ToString("yyyy-MM-dd"));
                if (!Directory.Exists(logDirectory))
                {
                    Directory.CreateDirectory(logDirectory);
                }

                string logFilePath = Path.Combine(logDirectory, $"error_{DateTime.Now:yyyyMMdd}.txt");
                await System.IO.File.AppendAllTextAsync(logFilePath, logError.Error);

                return Ok();
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Error interno al intentar registrar el log");
            }
        }
    }

    public class LogErrorDto
    {
        public string Error { get; set; }
    }

}
