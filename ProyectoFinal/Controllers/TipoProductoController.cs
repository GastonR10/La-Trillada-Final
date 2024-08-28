using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProyectoFinal.Models;
using ReglasNegocio.DTO_Entities;
using ReglasNegocio.Entities;

namespace ProyectoFinal.Controllers
{
    public class TipoProductoController : Controller
    {
        private readonly BarContext _context;
        private readonly ErrorLogger _errorLogger;

        public TipoProductoController(BarContext context, ErrorLogger errorLogger)
        {
            _context = context;
            _errorLogger = errorLogger;
        }
          
      

        // Método para obtener la lista de tipos de productos
        [HttpGet]
        public async Task<IActionResult> GetTiposProducto()
        {
            try
            {
                List<DTO_TipoProducto> tiposProducto = await _context.TipoProductos
                    .OrderBy(x => x.Orden)
                    .Select(tp => new DTO_TipoProducto(tp)).ToListAsync();

                return Json(tiposProducto);
            }
            catch (Exception ex)
            {
                await _errorLogger.LogErrorAsync($"{DateTime.Now}: {ex.Message} {Environment.NewLine} {ex.StackTrace}");
                return StatusCode(500);
            }
        }

        [HttpGet]
        public IActionResult GetTipoProductosView()
        {
            return View("TipoProductos");
        }

        [HttpPost]
        public async Task<IActionResult> OrdenarTipos([FromBody] List<DTO_TipoProducto> tipos)
        {
            try
            {
                foreach (DTO_TipoProducto tipo in tipos)
                {
                    TipoProducto? tipoBD = await _context.TipoProductos.FindAsync(tipo.Id);
                    if (tipoBD == null) return NotFound($"No existe el tipoProducto con id: {tipo.Id}");

                    tipoBD.Orden = tipo.Orden;

                }

                await _context.SaveChangesAsync();

                return Ok();
            }
            catch (Exception ex)
            {
                await _errorLogger.LogErrorAsync($"{DateTime.Now}: {ex.Message} {Environment.NewLine} {ex.StackTrace}");
                return StatusCode(500);
            }

        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] DTO_TipoProducto tipoDTO)
        {
            try
            {
                if (tipoDTO.Descripcion == "" || tipoDTO.Descripcion == null)
                {
                    return BadRequest("Ingrese un nombre para el tipo de producto.");
                }

                TipoProducto tipo = new TipoProducto(tipoDTO.Descripcion);                
                _context.TipoProductos.Add(tipo);
                await _context.SaveChangesAsync();
                tipo.Orden = tipo.Id;
                await _context.SaveChangesAsync();
                return Ok();
            }
            catch (Exception ex)
            {
                await _errorLogger.LogErrorAsync($"{DateTime.Now}: {ex.Message} {Environment.NewLine} {ex.StackTrace}");
                return StatusCode(500);
            }            
        }

        [HttpDelete("TipoProducto/Delete/{Id}")]
        public async Task<IActionResult> Delete(int Id)
        {
            try
            {
                TipoProducto? tipoBD = await _context.TipoProductos.FindAsync(Id);

                if (tipoBD == null)
                {
                    return NotFound($"No existe el tipo de producto con id: {Id}");
                }

                List<Producto> prods = await _context.Productos.Where(p => p.IdTipoProducto == Id).ToListAsync();

                if (prods.Count() > 0)
                {
                    return BadRequest("No se puede eliminar un tipo si tiene productos.");
                }                                                                                                    
                

                _context.TipoProductos.Remove(tipoBD);
                await _context.SaveChangesAsync();

                return Ok();
            }
            catch (Exception ex)
            {
                await _errorLogger.LogErrorAsync($"{DateTime.Now}: {ex.Message} {Environment.NewLine} {ex.StackTrace}");
                return StatusCode(500);
            }
        }
    }
}