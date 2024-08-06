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

        public CarritoController(BarContext context)
        {
            _db = context;
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

                if (existingUser == null)
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
                // Retornar un error 500 con un mensaje de error
                return StatusCode(500, $"Error interno del servidor: {ex.Message}");
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
                // Retornar un error 500 con un mensaje de error
                return StatusCode(500, $"Error interno del servidor: {ex.Message}");
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
                    // Si el usuario no existe, retornar un BadRequest con un mensaje
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
                // Retornar un error 500 con un mensaje de error
                return StatusCode(500, $"Error interno del servidor: {ex.Message}");
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
                    // Si el objeto no existe, retornar un NotFound con un mensaje
                    return NotFound("La línea de producto no existe.");
                }

                // Eliminar el objeto de la base de datos
                _db.ProductoCantidad.Remove(productoCantidad);
                await _db.SaveChangesAsync();

                return Ok();            
            }
            catch (Exception ex)
            {
                // Retornar un error 500 con un mensaje de error
                return StatusCode(500, $"Error interno del servidor: {ex.Message}");
            }
        }
    }
}
