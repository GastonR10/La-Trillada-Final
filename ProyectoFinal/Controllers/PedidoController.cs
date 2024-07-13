using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProyectoFinal.Models;
using ReglasNegocio.DTO_Entities;
using ReglasNegocio.Entities;

namespace ProyectoFinal.Controllers
{
    public class PedidoController : Controller
    {
        private readonly BarContext _db;

        public PedidoController(BarContext context)
        {
            _db = context;
        }

        public IActionResult PedidoLogueado()
        {
            return View();
        }

        [HttpPost("RealizarPedidoLogueado")]
        public async Task<IActionResult> RealizarPedidoLogueado([FromBody] DTO_RealizarPedidoLogueadoRequest rp)
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

                _db.Pedidos.Add(new PedidoCliente(rp.Comentario, existingUser.CarritoAbiertoId, rp.Mesa, rp.PagoTipo, rp.Dir, existingUser.Id));


           //     public PedidoCliente(string comentario, Carrito carrito, int idMesa, bool pos, Usuario cliente)
           // : base(comentario, carrito, idMesa, pos)
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
