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

        public MesaController(BarContext context, IWebHostEnvironment webHostEnvironment)
        {
            _db = context;
            _webHostEnvironment = webHostEnvironment;
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
                return BadRequest(ex.Message);
            }

        }
    }
}
