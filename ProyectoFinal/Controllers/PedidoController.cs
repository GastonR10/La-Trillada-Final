using Microsoft.AspNetCore.Mvc;
using Microsoft.CodeAnalysis.CSharp;
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

        [HttpGet("Pedido/GetPedidoVista/{id}")]
        public IActionResult GetPedidoVista(int id)
        {
            return View("PedidoVista", id);
        }

        [HttpGet("Pedido/GetPedido/{id}")]
        public async Task<IActionResult> GetPedido(int id)
        {
            try
            {
                Pedido? pedido = await _db.Pedidos.FindAsync(id);

                if (pedido == null) return NotFound($"No existe el pedido con id: {id}");

                string? tipoPedido = _db.Entry(pedido).Property("TipoPedido").CurrentValue as string;

                if (tipoPedido == "Cliente")
                {
                    // Lógica para PedidoCliente
                    PedidoCliente? pedidoCliente = await _db.Pedidos.OfType<PedidoCliente>()
                                                        .Include(p => p.Cliente)
                                                        .Include(p => p.Carrito)
                                                            .ThenInclude(c => c.CantidadesProductos)
                                                                .ThenInclude(pc => pc.Producto)
                                                        .FirstOrDefaultAsync(p => p.Id == pedido.Id);

                    if (pedidoCliente != null)
                    {
                        DTO_PedidoCliente pedidoDTO = new DTO_PedidoCliente(pedidoCliente);
                        return Ok(pedidoDTO);
                    }

                    return NotFound();

                }

                else if (tipoPedido == "Express")
                {
                    // Lógica para PedidoExpress
                    PedidoExpress? pedidoExpress = await _db.Pedidos.OfType<PedidoExpress>()
                                                        .Include(p => p.Carrito)
                                                            .ThenInclude(c => c.CantidadesProductos)
                                                                .ThenInclude(pc => pc.Producto)
                                                        .FirstOrDefaultAsync(p => p.Id == pedido.Id);

                    if (pedidoExpress != null)
                    {
                        DTO_PedidoExpress pedidoDTO = new DTO_PedidoExpress(pedidoExpress);
                        return Ok(pedidoDTO);
                    }

                    return NotFound();
                }
                else
                {
                    // Manejo de otros tipos de pedidos o error
                    return NotFound();
                }

            }
            catch (Exception ex)
            {
                return NotFound(ex.Message);
            }
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
                    .Include(p => p.CarritoAbierto)
                        .ThenInclude(c => c.CantidadesProductos)
                            .ThenInclude(pc => pc.Producto)
                    .FirstOrDefaultAsync(u => u.NombreUsuario == HttpContext.Session.GetString("Usuario"));

                if (existingUser == null)
                {
                    return BadRequest("El usuario no existe.");
                }

                // Crear un nuevo pedido y agregarlo a la base de datos
                PedidoCliente pedido = new PedidoCliente(rp.Comentario, existingUser.CarritoAbiertoId, rp.Mesa, rp.PagoTipo, rp.Dir, existingUser.Id);
                _db.Pedidos.Add(pedido);

                //Fijar precio total del carrito viejo
                Carrito carritoViejo = existingUser.CarritoAbierto;
                decimal total = 0;
                foreach (ProductoCantidad pc in carritoViejo.CantidadesProductos)
                {
                    total += pc.Cantidad * pc.Producto.Precio;
                }
                carritoViejo.PrecioTotal = total;

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

                //Fijar precio total del carrito viejo y cargando pc en bd
                decimal total = 0;
                foreach (DTO_ProductoCantidad pc in rp.Carrito.ProductosCantidad)
                {
                    total += pc.Cantidad * pc.Producto.Precio;

                    ProductoCantidad productoCantidad = new ProductoCantidad(pc);
                    productoCantidad.IdCarrito = nuevoCarrito.Id;
                    _db.ProductoCantidad.Add(productoCantidad);
                }

                nuevoCarrito.PrecioTotal = total;
                _db.Entry(nuevoCarrito).State = EntityState.Modified;

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
                List<PedidoCliente> pedidosCliente = await _db.Pedidos.OfType<PedidoCliente>()
                                                      .Include(p => p.Cliente)
                                                      .Include(p => p.Carrito)
                                                            .ThenInclude(c => c.CantidadesProductos)
                                                                .ThenInclude(pc => pc.Producto)
                                                      .Where(p => p.Estado != Estado.Cancelado && p.Estado != Estado.Finalizado)
                                                      .ToListAsync();

                List<PedidoExpress> pedidosExpress = await _db.Pedidos.OfType<PedidoExpress>()
                                                      .Include(p => p.Carrito)
                                                            .ThenInclude(c => c.CantidadesProductos)
                                                                .ThenInclude(pc => pc.Producto)
                                                      .Where(p => p.Estado != Estado.Cancelado && p.Estado != Estado.Finalizado)
                                                      .ToListAsync();

                List<DTO_PedidoCliente> pedidosClienteDTO = pedidosCliente.Select(p => new DTO_PedidoCliente(p)).ToList();
                List<DTO_PedidoExpress> pedidosExpressDTO = pedidosExpress.Select(p => new DTO_PedidoExpress(p)).ToList();

                return Ok(new
                {
                    PedidosCliente = pedidosClienteDTO,
                    PedidosExpress = pedidosExpressDTO
                });

            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }

        }

        [HttpPost]
        public async Task<IActionResult> ActualizarEstadoPedido([FromBody] int id)
        {
            try
            {
                Pedido? pedido = await _db.Pedidos.FindAsync(id);

                if (pedido == null)
                {
                    return NotFound();
                }

                switch (pedido.Estado)
                {
                    case Estado.Pendiente:
                        pedido.Estado = Estado.EnPreparacion;
                        break;

                    case Estado.EnPreparacion:
                        pedido.Estado = Estado.EnCamino;
                        break;

                    case Estado.EnCamino:
                        pedido.Estado = Estado.Finalizado;
                        break;

                    default:
                        // Manejar otros casos si es necesario
                        break;
                }

                _db.Pedidos.Update(pedido);

                await _db.SaveChangesAsync();

                return Ok(pedido);


            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }

        }

        [HttpPost]
        public async Task<IActionResult> CancelarPedido([FromBody] int id)
        {
            try
            {
                Pedido? pedido = await _db.Pedidos.FindAsync(id);

                if (pedido == null)
                {
                    return NotFound();
                }

                pedido.Estado = Estado.Cancelado;

                _db.Pedidos.Update(pedido);

                await _db.SaveChangesAsync();

                return Ok(pedido);


            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }

        }

        public IActionResult PedidosFinalizados()
        {
            return View();
        }

        [HttpGet]
        public async Task<IActionResult> GetPedidosFinalizados()
        {
            try
            {
                List<PedidoCliente> pedidosCliente = await _db.Pedidos.OfType<PedidoCliente>()
                                                      .Include(p => p.Cliente)
                                                      .Include(p => p.Carrito)
                                                            .ThenInclude(c => c.CantidadesProductos)
                                                                .ThenInclude(pc => pc.Producto)
                                                      .Where(p => p.Estado == Estado.Finalizado)
                                                      .ToListAsync();

                List<PedidoExpress> pedidosExpress = await _db.Pedidos.OfType<PedidoExpress>()
                                                      .Include(p => p.Carrito)
                                                            .ThenInclude(c => c.CantidadesProductos)
                                                                .ThenInclude(pc => pc.Producto)
                                                      .Where(p => p.Estado == Estado.Finalizado)
                                                      .ToListAsync();

                List<DTO_PedidoCliente> pedidosClienteDTO = pedidosCliente.Select(p => new DTO_PedidoCliente(p)).ToList();
                List<DTO_PedidoExpress> pedidosExpressDTO = pedidosExpress.Select(p => new DTO_PedidoExpress(p)).ToList();

                return Ok(new
                {
                    PedidosCliente = pedidosClienteDTO,
                    PedidosExpress = pedidosExpressDTO
                });


            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }

        }

        public async Task<IActionResult> GetPedidos()
        {
            try
            {
                List<PedidoCliente> pedidosCliente = await _db.Pedidos.OfType<PedidoCliente>()
                                                      .Include(p => p.Cliente)
                                                      .ToListAsync();

                List<PedidoExpress> pedidosExpress = await _db.Pedidos.OfType<PedidoExpress>()
                                                      .ToListAsync();

                List<DTO_PedidoCliente> pedidosClienteDTO = pedidosCliente.Select(p => new DTO_PedidoCliente(p)).ToList();
                List<DTO_PedidoExpress> pedidosExpressDTO = pedidosExpress.Select(p => new DTO_PedidoExpress(p)).ToList();

                return Ok(new
                {
                    PedidosCliente = pedidosClienteDTO,
                    PedidosExpress = pedidosExpressDTO
                });
            }
            catch (Exception ex)
            {
                return NotFound(ex.Message);
            }
        }

    }
}
