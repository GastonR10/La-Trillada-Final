using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProyectoFinal.Models;
using ReglasNegocio.DTO_Entities;
using ReglasNegocio.Entities;

namespace ProyectoFinal.Controllers
{
    public class CarritoController : Controller
    {

        private readonly BarContext _db;
        private readonly ErrorLogger _errorLogger;

        public CarritoController(BarContext context, ErrorLogger errorLogger)
        {
            _db = context;
            _errorLogger = errorLogger;
        }

        public IActionResult Carrito()
        {
            return View();
        }


        [HttpPost("AgregarProducto")]
        public async Task<IActionResult> AgregarProducto([FromBody] DTO_ProductoCantidad pc)
        {
            try
            {
                // Verificar si el usuario ya existe en la base de datos
                Usuario? existingUser = await _db.Usuarios
                    .FirstOrDefaultAsync(u => u.NombreUsuario == HttpContext.Session.GetString("Usuario"));
                
                if (existingUser.Nombre == null)
                {
                    // Si el usuario no existe, retornar un BadRequest con un mensaje
                    return BadRequest("El usuario no existe.");
                }

                
                _db.ProductoCantidad.Add(new ProductoCantidad(pc.IdProducto, pc.Cantidad, existingUser.CarritoAbiertoId));
              
                await _db.SaveChangesAsync();              
                return Ok();

            }
            catch (Exception ex)
            {
                await _errorLogger.LogErrorAsync($"{DateTime.Now}: {ex.Message} \n {ex.StackTrace} \n\n");
                return StatusCode(500);
            }
        }

        [HttpGet("ObtenerTotalCarrito")]
        public async Task<IActionResult> ObtenerTotalCarrito()
        {
            try
            {
                // Verificar si el usuario ya existe en la base de datos
                Usuario? existingUser = await _db.Usuarios
                                                    .Include(c => c.CarritoAbierto)
                                                        .ThenInclude(pc => pc.CantidadesProductos)
                                                            .ThenInclude(p => p.Producto)
                                                    .FirstOrDefaultAsync(u => u.NombreUsuario == HttpContext.Session.GetString("Usuario"));

                
                if (existingUser == null)
                {
                    // Si el usuario no existe, retornar un BadRequest con un mensaje
                    return BadRequest("El usuario no existe.");
                }

                decimal total = 0;
                // Verificar si el CarritoAbierto es nulo
                if (existingUser.CarritoAbierto == null)
                {
                    return Ok(total);
                }

                foreach (ProductoCantidad pc in existingUser.CarritoAbierto.CantidadesProductos)
                {
                    total += pc.Cantidad * pc.Producto.Precio;
                };
                
                return Ok(total);

            }
            catch (Exception ex)
            {
                await _errorLogger.LogErrorAsync($"{DateTime.Now}: {ex.Message} \n {ex.StackTrace} \n\n");
                return StatusCode(500);
            }
        }


        [HttpGet("ObtenerProductosCarrito")]
        public async Task<IActionResult> ObtenerProductosCarrito()
        {
            try
            {
                // Verificar si el usuario ya existe en la base de datos
                Usuario? existingUser = await _db.Usuarios
                    .FirstOrDefaultAsync(u => u.NombreUsuario == HttpContext.Session.GetString("Usuario"));

                if (existingUser == null)
                {
                    return BadRequest("El usuario no existe.");
                }

                int idCarrito = existingUser.CarritoAbiertoId;
                List<DTO_ProductoCantidad> list = await _db.ProductoCantidad.Where(p => p.IdCarrito == idCarrito)
                                                    .Include(p => p.Producto)
                                                    .Select(p => new DTO_ProductoCantidad(p))                                                    
                                                    .ToListAsync();
                
                
                return Json(list);

            }
            catch (Exception ex)
            {
                await _errorLogger.LogErrorAsync($"{DateTime.Now}: {ex.Message} \n {ex.StackTrace} \n\n");
                return StatusCode(500);
            }
        }

        [HttpPost("EliminarLinea")]
        public async Task<IActionResult> EliminarLinea([FromBody] int id)
        {
            try
            {
                // Verificar si el usuario ya existe en la base de datos
                Usuario? existingUser = await _db.Usuarios
                    .FirstOrDefaultAsync(u => u.NombreUsuario == HttpContext.Session.GetString("Usuario"));

                if (existingUser == null)
                {
                    // Si el usuario no existe, retornar un BadRequest con un mensaje
                    return BadRequest("El usuario no existe.");
                }

                // Buscar el objeto ProductoCantidad por su ID
                ProductoCantidad? productoCantidad = await _db.ProductoCantidad
                    .FirstOrDefaultAsync(pc => pc.Id == id);

                if (productoCantidad == null)
                {
                    return NotFound("La línea de producto no existe.");
                }

                // Eliminar el objeto de la base de datos
                _db.ProductoCantidad.Remove(productoCantidad);
                await _db.SaveChangesAsync();

                return Ok();            
            }
            catch (Exception ex)
            {
                await _errorLogger.LogErrorAsync($"{DateTime.Now}: {ex.Message} \n {ex.StackTrace} \n\n");
                return StatusCode(500);
            }
        }
    }
}
