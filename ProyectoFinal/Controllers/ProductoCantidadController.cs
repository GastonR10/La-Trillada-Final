using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProyectoFinal.Models;
using ReglasNegocio.DTO_Entities;
using ReglasNegocio.Entities;

namespace ProyectoFinal.Controllers
{
    public class ProductoCantidadController : Controller
    {
        private readonly BarContext _db;

        public ProductoCantidadController(BarContext context)
        {
            _db = context;
        }

        [HttpPost("ActualizarComentarios")]
        public async Task<IActionResult> ActualizarComentarios([FromBody] List<DTO_ProductoCantidad> duplas)
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

                // Actualizar los comentarios de los productos
                foreach (var dupla in duplas)
                {
                    var productoCantidad = await _db.ProductoCantidad
                        .FirstOrDefaultAsync(pc => pc.Id == dupla.Id);

                    if (productoCantidad != null)
                    {
                        productoCantidad.Comentario = dupla.Comentario;
                        _db.ProductoCantidad.Update(productoCantidad);
                    }
                }

                await _db.SaveChangesAsync();
                return Ok();              
            }
            catch (Exception ex)
            {
                return StatusCode(500);
            }
        }
    }
}
