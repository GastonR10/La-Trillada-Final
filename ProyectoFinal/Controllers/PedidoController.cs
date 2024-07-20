using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProyectoFinal.Models;
using ReglasNegocio;
using ReglasNegocio.DTO_Entities;
using ReglasNegocio.Entities;
using static ReglasNegocio.Enums;

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

        public IActionResult PedidoExpress()
        {
            return View();
        }

        [HttpPost("RealizarPedidoExpress")]
        public async Task<IActionResult> RealizarPedidoExpress([FromBody] DTO_RealizarPedidoExpressRequest rp)
        {
            try
            {

                // Crear un nuevo carrito y agregarlo a la base de datos
                Carrito nuevoCarrito = new Carrito();
                _db.Carritos.Add(nuevoCarrito);

                // Guardar los cambios para obtener el nuevo Id del carrito
                await _db.SaveChangesAsync();

                foreach (var pc in rp.Carrito.ProductosCantidad) { 
                    
                    ProductoCantidad productoCantidad = new ProductoCantidad(pc);
                    productoCantidad.IdCarrito = nuevoCarrito.Id;
                    _db.ProductoCantidad.Add(productoCantidad);
                }

                // Guardar los cambios para los productos cantidad
                await _db.SaveChangesAsync();

                // Crear un nuevo pedido y agregarlo a la base de datos
                PedidoExpress pedido = new PedidoExpress(rp.Comentario, nuevoCarrito.Id, rp.Mesa, rp.PagoTipo, rp.Dir, rp.Mail, rp.Tel.ToString(), rp.Nombre);
                _db.Pedidos.Add(pedido);             
                            
                await _db.SaveChangesAsync();

                return Ok();

            }
            catch (Exception ex)
            {
                // Retornar un error 500 con un mensaje de error
                return StatusCode(500, $"Error interno del servidor: {ex.Message}");
            }
        }

        public IActionResult AdministracionPedidos()
        {
            return View();
        }

        [HttpGet]
        public async Task<IActionResult> PedidosPendientes()
        {
            try
            {
                List<DTO_Pedido> pedidosPendientes = await _db.Pedidos
                                             .Where(p => p.Estado != Estado.Cancelado && p.Estado != Estado.Finalizado)
                                             .Select(p => new DTO_Pedido(p))
                                             .ToListAsync();

                
                return Json(pedidosPendientes);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }

        }
    }
}
