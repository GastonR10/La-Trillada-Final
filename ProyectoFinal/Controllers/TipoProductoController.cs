using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProyectoFinal.Models;
using ReglasNegocio.DTO_Entities;

namespace ProyectoFinal.Controllers
{
    public class TipoProductoController : Controller
    {
        private readonly BarContext _context;

        public TipoProductoController(BarContext context)
        {
            _context = context;
        }

        // Método para obtener la lista de tipos de productos
        [HttpGet]
        public async Task<IActionResult> GetTiposProducto()
        {
            try
            {
                var tiposProducto = await _context.TipoProductos
                    .OrderBy(x => x.Orden)
                    .Select(tp => new DTO_TipoProducto(tp)).ToListAsync();

                return Json(tiposProducto);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

    }
}