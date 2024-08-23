using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProyectoFinal.Models;
using ReglasNegocio.DTO_Entities;
using ReglasNegocio.Entities;

namespace ProyectoFinal.Controllers
{
    public class MesaController : Controller
    {
        private readonly BarContext _db;
        private readonly IWebHostEnvironment _webHostEnvironment;
        private readonly ErrorLogger _errorLogger;

        public MesaController(BarContext context, IWebHostEnvironment webHostEnvironment, ErrorLogger errorLogger)
        {
            _db = context;
            _webHostEnvironment = webHostEnvironment;
            _errorLogger = errorLogger;
        }

        [HttpGet]
        public async Task<IActionResult> GetMesas()
        {
            try
            {
                List<DTO_Mesa> mesas = await _db.Mesa
                    .Select(m => new DTO_Mesa(m)) 
                    .ToListAsync();

                return Json(mesas);
            }
            catch (Exception ex)
            {
                await _errorLogger.LogErrorAsync($"{DateTime.Now}: {ex.Message} \n {ex.StackTrace} \n\n");
                return StatusCode(500);
            }

        }
    }
}
