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
                    return BadRequest("El usuario no existe.");
                }

                // Crear un nuevo pedido y agregarlo a la base de datos
                PedidoCliente pedido = new PedidoCliente(rp.Comentario, existingUser.CarritoAbiertoId, rp.Mesa, rp.PagoTipo, rp.Dir, existingUser.Id);
                _db.Pedidos.Add(pedido);

                // Crear un nuevo carrito y agregarlo a la base de datos
                Carrito nuevoCarrito = new Carrito();
                _db.Carritos.Add(nuevoCarrito);

                // Guardar los cambios para obtener el nuevo Id del carrito
                await _db.SaveChangesAsync();

                // Asignar el nuevo IdCarritoAbierto al usuario
                existingUser.CarritoAbiertoId = nuevoCarrito.Id;

                // Guardar los cambios en el usuario
                _db.Usuarios.Update(existingUser);
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
