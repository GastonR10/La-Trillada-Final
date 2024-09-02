using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
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
        private readonly IHubContext<NotificationHub> _hubContext;
        private readonly WhatsAppService _whatsAppService;
        private readonly ErrorLogger _errorLogger;

        public PedidoController(BarContext context, IHubContext<NotificationHub> hubContext, ErrorLogger errorLogger)
        {
            _db = context;
            _hubContext = hubContext;
            _whatsAppService = new WhatsAppService();
            _errorLogger = errorLogger;
        }

        [Authorize(Policy = "AdminOnly")]
        [HttpGet("Pedido/GetPedidoVista/{id}")]
        public IActionResult GetPedidoVista(int id)
        {
            return View("PedidoVista", id);
        }

        [Authorize(Policy = "ClienteOnly")]
        [HttpGet("Pedido/VerPedidoCliente/{id}")]
        public IActionResult VerPedidoCliente(int id)
        {
            return View("VerPedidoCliente", id);
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

                    return NotFound("Tipo de pedido no existente.");

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

                    return NotFound("Tipo de pedido no existente.");
                }
                else
                {
                    // Manejo de otros tipos de pedidos o error
                    return NotFound("Tipo de pedido no existente.");
                }

            }
            catch (Exception ex)
            {
                await _errorLogger.LogErrorAsync($"{DateTime.Now}: {ex.Message} {Environment.NewLine} {ex.StackTrace}");
                return StatusCode(500);
            }
        }

        [Authorize(Policy = "AdminOnly")]
        public IActionResult PedidoAdmin()
        {
            return View();
        }

        [Authorize(Policy = "ClienteOnly")]
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

                if (existingUser.CarritoAbierto != null && existingUser.CarritoAbierto.CantidadesProductos.Count == 0)
                {
                    return BadRequest("Carrito vacío.");
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

                // Enviar notificación a los clientes
                await _hubContext.Clients.All.SendAsync("RecibirPedido", pedido.Id);


                if (HttpContext.Session.GetString("rol") == "Cliente")
                {
                    string numeroDestino = "+598" + existingUser.Telefono;
                    string mensaje = "¡Hola! tu pedido fue recibido, en seguida lo confirmamos.";

                    await _whatsAppService.EnviarNotificacionWhatsAppAsync(numeroDestino, mensaje);
                }

                return Ok();

            }
            catch (Exception ex)
            {
                await _errorLogger.LogErrorAsync($"{DateTime.Now}: {ex.Message} {Environment.NewLine} {ex.StackTrace}");
                return StatusCode(500);
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
                if (rp.Carrito.ProductosCantidad == null || rp.Carrito.ProductosCantidad.Count == 0)
                {
                    return BadRequest("Carrito vacío");
                }

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

                await _hubContext.Clients.All.SendAsync("RecibirPedido", pedido.Id);

                if (rp.Tel != -1)
                {
                    string numeroDestino = "+598" + pedido.Telefono;
                    string mensaje = "¡Hola! tu pedido fue recibido, en seguida lo confirmamos.";

                    await _whatsAppService.EnviarNotificacionWhatsAppAsync(numeroDestino, mensaje);
                }

                return Ok();

            }
            catch (Exception ex)
            {
                await _errorLogger.LogErrorAsync($"{DateTime.Now}: {ex.Message} {Environment.NewLine} {ex.StackTrace}");
                return StatusCode(500);
            }
        }


        [Authorize(Policy = "AdminOnly")]
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
                await _errorLogger.LogErrorAsync($"{DateTime.Now}: {ex.Message} {Environment.NewLine} {ex.StackTrace}");
                return StatusCode(500);
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
                    return NotFound("Pedido no encontrado.");
                }

                string? tipoPedido = _db.Entry(pedido).Property("TipoPedido").CurrentValue as string;

                string numeroDestino = "+598";
                string mensaje = "";

                if (tipoPedido == "Cliente")
                {
                    // Lógica para PedidoCliente
                    PedidoCliente? pedidoCliente = await _db.Pedidos.OfType<PedidoCliente>()
                                                        .Include(p => p.Cliente)
                                                        .FirstOrDefaultAsync(p => p.Id == pedido.Id);

                    if (pedidoCliente == null)
                    {
                        return NotFound("Cliente no encontrado.");
                    }

                    // Verificar si Telefono es null
                    string telefonoCliente = pedidoCliente.Cliente.Telefono ?? "-1";

                    // Eliminar el primer dígito si es '0'
                    telefonoCliente = telefonoCliente.TrimStart('0');

                    if (telefonoCliente == "-1")
                    {
                        numeroDestino = "-1";
                    }
                    else
                    {
                        numeroDestino += telefonoCliente;
                    }

                }
                else if (tipoPedido == "Express")
                {
                    // Lógica para PedidoExpress
                    PedidoExpress? pedidoExpress = await _db.Pedidos.OfType<PedidoExpress>()
                                                        .FirstOrDefaultAsync(p => p.Id == pedido.Id);

                    if (pedidoExpress == null)
                    {
                        return NotFound();
                    }

                    if (pedidoExpress.Telefono == "-1")
                    {
                        numeroDestino = "-1";
                    }
                    else
                    {
                        string telefono = pedidoExpress.Telefono.TrimStart('0');
                        numeroDestino += telefono;
                    }
                }
                else
                {
                    // Manejo de otros tipos de pedidos o error
                    return NotFound();
                }

                switch (pedido.Estado)
                {
                    case Estado.Pendiente:
                        mensaje += "Tu pedido fue confirmado con el numero " + pedido.Id + " y está en preparación";
                        pedido.Estado = Estado.EnPreparacion;
                        await _hubContext.Clients.All.SendAsync("PedidoAceptado", pedido.Id);
                        break;

                    case Estado.EnPreparacion:
                        mensaje += "Pedido numero " + pedido.Id + " va en camino";
                        pedido.Estado = Estado.EnCamino;
                        await _hubContext.Clients.All.SendAsync("PedidoPronto", pedido.Id);
                        break;

                    case Estado.EnCamino:
                        mensaje += "Pedido numero " + pedido.Id + " entregado con exito";
                        pedido.Estado = Estado.Finalizado;
                        break;

                    default:
                        // Manejar otros casos si es necesario
                        break;
                }

                _db.Pedidos.Update(pedido);

                await _db.SaveChangesAsync();

                if (numeroDestino != "-1")
                {
                    await _whatsAppService.EnviarNotificacionWhatsAppAsync(numeroDestino, mensaje);
                }

                return Ok(pedido.Estado);


            }
            catch (Exception ex)
            {
                await _errorLogger.LogErrorAsync($"{DateTime.Now}: {ex.Message} {Environment.NewLine} {ex.StackTrace}");
                return StatusCode(500);
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


                string? tipoPedido = _db.Entry(pedido).Property("TipoPedido").CurrentValue as string;

                string numeroDestino = "+598";
                string mensaje = "Pedido numero " + pedido.Id + " fue cancelado.";

                if (tipoPedido == "Cliente")
                {
                    // Lógica para PedidoCliente
                    PedidoCliente? pedidoCliente = await _db.Pedidos.OfType<PedidoCliente>()
                                                        .Include(p => p.Cliente)
                                                        .FirstOrDefaultAsync(p => p.Id == pedido.Id);

                    if (pedidoCliente == null)
                    {
                        return NotFound();
                    }

                    // Verificar si Telefono es null
                    string telefonoCliente = pedidoCliente.Cliente.Telefono ?? "-1";

                    // Eliminar el primer dígito si es '0'
                    telefonoCliente = telefonoCliente.TrimStart('0');

                    if (telefonoCliente == "-1")
                    {
                        numeroDestino = "-1";
                    }
                    else
                    {
                        numeroDestino += telefonoCliente;
                    }

                }
                else if (tipoPedido == "Express")
                {
                    // Lógica para PedidoExpress
                    PedidoExpress? pedidoExpress = await _db.Pedidos.OfType<PedidoExpress>()
                                                        .FirstOrDefaultAsync(p => p.Id == pedido.Id);

                    if (pedidoExpress == null)
                    {
                        return NotFound();
                    }

                    if (pedidoExpress.Telefono == "-1")
                    {
                        numeroDestino = "-1";
                    }
                    else
                    {
                        string telefono = pedidoExpress.Telefono.TrimStart('0');
                        numeroDestino += telefono;
                    }
                }
                else
                {
                    // Manejo de otros tipos de pedidos o error
                    return NotFound();
                }

                pedido.Estado = Estado.Cancelado;

                _db.Pedidos.Update(pedido);

                await _db.SaveChangesAsync();

                if (numeroDestino != "-1")
                {
                    await _whatsAppService.EnviarNotificacionWhatsAppAsync(numeroDestino, mensaje);
                }

                return Ok();


            }
            catch (Exception ex)
            {
                await _errorLogger.LogErrorAsync($"{DateTime.Now}: {ex.Message} {Environment.NewLine} {ex.StackTrace}");
                return StatusCode(500);
            }

        }

        [Authorize(Policy = "AdminOnly")]
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
                await _errorLogger.LogErrorAsync($"{DateTime.Now}: {ex.Message} {Environment.NewLine} {ex.StackTrace}");
                return StatusCode(500);
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
                await _errorLogger.LogErrorAsync($"{DateTime.Now}: {ex.Message} {Environment.NewLine} {ex.StackTrace}");
                return StatusCode(500);
            }
        }

        [Authorize(Policy = "ClienteOnly")]
        public IActionResult PedidosCliente()
        {
            return View();
        }

        [HttpGet]
        public async Task<IActionResult> PedidosClienteLogueado()
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

                List<PedidoCliente> pedidosCliente = await _db.Pedidos.OfType<PedidoCliente>()
                                                      .Include(p => p.Cliente)
                                                      .Include(p => p.Carrito)
                                                            .ThenInclude(c => c.CantidadesProductos)
                                                                .ThenInclude(pc => pc.Producto)
                                                      .Where(p => p.ClienteId == existingUser.Id)
                                                      .ToListAsync();



                List<DTO_PedidoCliente> pedidosClienteDTO = pedidosCliente.Select(p => new DTO_PedidoCliente(p)).ToList();


                return Ok(pedidosClienteDTO);


            }
            catch (Exception ex)
            {
                await _errorLogger.LogErrorAsync($"{DateTime.Now}: {ex.Message} {Environment.NewLine} {ex.StackTrace}");
                return StatusCode(500);
            }

        }

        [Authorize(Policy = "AdminOnly")]
        public IActionResult PedidosCocina()
        {
            return View();
        }

        [HttpGet]
        public async Task<IActionResult> GetPedidosCocina()
        {
            try
            {
                List<PedidoCliente> pedidosCliente = await _db.Pedidos.OfType<PedidoCliente>()
                                                      .Include(p => p.Cliente)
                                                      .Include(p => p.Carrito)
                                                            .ThenInclude(c => c.CantidadesProductos)
                                                                .ThenInclude(pc => pc.Producto)
                                                      .Where(p => p.Estado == Estado.EnPreparacion)
                                                      .ToListAsync();

                List<PedidoExpress> pedidosExpress = await _db.Pedidos.OfType<PedidoExpress>()
                                                      .Include(p => p.Carrito)
                                                            .ThenInclude(c => c.CantidadesProductos)
                                                                .ThenInclude(pc => pc.Producto)
                                                      .Where(p => p.Estado == Estado.EnPreparacion)
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
                await _errorLogger.LogErrorAsync($"{DateTime.Now}: {ex.Message} {Environment.NewLine} {ex.StackTrace}");
                return StatusCode(500);
            }

        }

    }
}
