using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProyectoFinal.Models;
using ReglasNegocio.DTO_Entities;
using ReglasNegocio.Entities;

namespace ProyectoFinal.Controllers
{
    public class ProductoController : Controller
    {
        private readonly BarContext _db;
        private readonly IWebHostEnvironment _webHostEnvironment;
        private readonly ErrorLogger _errorLogger;

        public ProductoController(BarContext context, IWebHostEnvironment webHostEnvironment, ErrorLogger errorLogger)
        {
            _db = context;
            _webHostEnvironment = webHostEnvironment;
            _errorLogger = errorLogger;
        }

        [Authorize(Policy = "AdminOnly")]
        public IActionResult CreateProducto()
        {
            return View("ProductoCreate");
        }

        [Authorize(Policy = "AdminOnly")]

        [HttpGet("Producto/GetProductoVista/{id}")]
        public IActionResult GetProductoVista(int id)
        {
            return View("ProductoEdit", id);
        }

        [HttpGet("Producto/GetProducto/{id}")]
        public async Task<IActionResult> GetProducto(int id)
        {
            try
            {
                Producto? producto = await _db.Productos.FindAsync(id);
                if (producto == null) return NotFound($"No existe el producto con id: {id}");
                return Ok(producto);
            }
            catch (Exception ex)
            {
                await _errorLogger.LogErrorAsync($"{DateTime.Now}: {ex.Message} \n {ex.StackTrace}; \n\n");
                return StatusCode(500);
            }
        }


        [HttpPost("Create")]
        public async Task<IActionResult> Create(IFormFile? file, string fileName, DTO_Producto prod)
        {
            try
            {
                if(prod.Nombre == "" || prod.Precio <= 0 || prod.IdTipoProducto == 0)
                {
                    return BadRequest();
                }

                if (file != null && file.Length > 0)
                {
                    string uploads = Path.Combine(_webHostEnvironment.WebRootPath, @"img\product");
                    if (!Directory.Exists(uploads))
                    {
                        Directory.CreateDirectory(uploads);
                    }

                    string filePath = Path.Combine(uploads, fileName);

                    using (var stream = new FileStream(filePath, FileMode.Create))
                    {
                        await file.CopyToAsync(stream);
                    }
                }

                Producto producto = new Producto(prod);
                producto.Foto = prod.Foto;
                _db.Productos.Add(producto);
                await _db.SaveChangesAsync();
                return Ok("Alta exitosa");

            }
            catch (Exception ex)
            {
                await _errorLogger.LogErrorAsync($"{DateTime.Now}: {ex.Message} \n {ex.StackTrace}; \n\n");
                return StatusCode(500);
            }
        }

        [HttpGet]
        public IActionResult GetProductos()
        {
            return View("Productos");
        }

        [HttpGet]
        public async Task<IActionResult> GetProductosActivos()
        {
            try
            {
                List<DTO_Producto> productos = await _db.Productos
                    .Where(p => p.Activo)
                    .Select(p => new DTO_Producto(p)).ToListAsync();

                return Json(productos);
            }
            catch (Exception ex)
            {
                await _errorLogger.LogErrorAsync($"{DateTime.Now}: {ex.Message} \n {ex.StackTrace}; \n\n");
                return StatusCode(500);
            }

        }

        [Authorize(Policy = "AdminOnly")]
        [HttpGet]
        public IActionResult GetProductosList()
        {
            return View("ProductosList");
        }

        [HttpGet]
        public IActionResult GetProductosMenu()
        {
            return View("ProductosMenu");
        }

        [HttpGet]
        public async Task<IActionResult> GetAllProductos()
        {
            try
            {
                List<DTO_Producto> productos = await _db.Productos
               .Where(p => !p.Eliminado)
               .Select(p => new DTO_Producto(p)).ToListAsync();

                return Json(productos);
            }
            catch (Exception ex)
            {
                await _errorLogger.LogErrorAsync($"{DateTime.Now}: {ex.Message} \n {ex.StackTrace}; \n\n");
                return StatusCode(500);
            }

        }

        [HttpPost]
        public async Task<IActionResult> UpdateProducto(IFormFile? fotoNueva, DTO_Producto productoDTO)
        {
            try
            {
                Producto? producto = await _db.Productos.FindAsync(productoDTO.Id);

                if (producto == null)
                {
                    return NotFound();
                }

                if (fotoNueva != null && fotoNueva.Length > 0)
                {
                    string filePath = "";

                    if (producto.Foto == null || producto.Foto == "null")
                    {
                        string fotoStringNuevaNombre = productoDTO.Foto.TrimStart('/');
                        filePath = Path.Combine(_webHostEnvironment.WebRootPath, fotoStringNuevaNombre);

                        string uploads = Path.Combine(_webHostEnvironment.WebRootPath, @"img\product");
                        if (!Directory.Exists(uploads))
                        {
                            Directory.CreateDirectory(uploads);
                        }
                    }
                    else
                    {
                        string fotoString = producto.Foto.TrimStart('/'); ;
                        filePath = Path.Combine(_webHostEnvironment.WebRootPath, fotoString);
                    }



                    using (var stream = new FileStream(filePath, FileMode.Create))
                    {
                        await fotoNueva.CopyToAsync(stream);
                    }
                }

                if(productoDTO.Nombre == "" || productoDTO.IdTipoProducto == 0 || productoDTO.Precio <= 0)
                {
                    return BadRequest();
                }

                // Actualizar los campos del producto según los valores en el DTO
                if (productoDTO.Nombre != null && productoDTO.Nombre != producto.Nombre)
                {
                    producto.Nombre = productoDTO.Nombre;
                }
                if (productoDTO.Descripcion != null && productoDTO.Descripcion != producto.Descripcion)
                {
                    producto.Descripcion = productoDTO.Descripcion;
                }
                if (fotoNueva != null && producto.Foto == null)
                {
                    producto.Foto = productoDTO.Foto;
                }
                if (productoDTO.IdTipoProducto != 0 && productoDTO.IdTipoProducto != producto.IdTipoProducto)
                {
                    producto.IdTipoProducto = productoDTO.IdTipoProducto;
                }
                if (productoDTO.Precio != 0 && productoDTO.Precio != producto.Precio)
                {
                    producto.Precio = productoDTO.Precio;
                }
                if (productoDTO.Activo != producto.Activo)
                {
                    producto.Activo = productoDTO.Activo;
                }
                if (productoDTO.Eliminado != producto.Eliminado)
                {
                    producto.Eliminado = productoDTO.Eliminado;
                }
                // Guardar los cambios en la base de datos

                await _db.SaveChangesAsync();

                return Ok();

            }
            catch (Exception ex)
            {
                await _errorLogger.LogErrorAsync($"{DateTime.Now}: {ex.Message} \n {ex.StackTrace}; \n\n");
                return StatusCode(500);
            }
        }

        [HttpPost]
        public async Task<IActionResult> EliminarProducto(DTO_Producto productoDTO)
        {
            try
            {
                Producto? producto = await _db.Productos.FindAsync(productoDTO.Id);

                if (producto == null)
                {
                    return NotFound();
                }

                if (productoDTO.Activo != producto.Activo)
                {
                    producto.Activo = productoDTO.Activo;
                }
                if (productoDTO.Eliminado != producto.Eliminado)
                {
                    producto.Eliminado = productoDTO.Eliminado;
                }

                await _db.SaveChangesAsync();

                return Ok();
            }
            catch (Exception ex)
            {
                await _errorLogger.LogErrorAsync($"{DateTime.Now}: {ex.Message} \n {ex.StackTrace}; \n\n");
                return StatusCode(500);
            }
        }

        [HttpPost]
        public async Task<IActionResult> ActivarDesactivarProducto(DTO_Producto productoDTO)
        {
            try
            {
                Producto? producto = await _db.Productos.FindAsync(productoDTO.Id);

                if (producto == null)
                {
                    return NotFound();
                }

                if (productoDTO.Activo != producto.Activo)
                {
                    producto.Activo = productoDTO.Activo;
                }

                await _db.SaveChangesAsync();

                return Ok();
            }
            catch (Exception ex)
            {
                await _errorLogger.LogErrorAsync($"{DateTime.Now}: {ex.Message} \n {ex.StackTrace}; \n\n");
                return StatusCode(500);
            }
        }

        [HttpPost("GetProductIds")]
        public async Task<IActionResult> GetProductIds([FromBody] List<int> IdsProduct)
        {
            try
            {
                List<DTO_Producto> productos = await _db.Productos
              .Where(p => IdsProduct.Contains(p.Id) && !p.Eliminado)
              .Select(p => new DTO_Producto(p))
              .ToListAsync();

                return Json(productos);

            }
            catch (Exception ex)
            {
                await _errorLogger.LogErrorAsync($"{DateTime.Now}: {ex.Message} \n {ex.StackTrace}; \n\n");
                return StatusCode(500);
            }

        }
    }
}