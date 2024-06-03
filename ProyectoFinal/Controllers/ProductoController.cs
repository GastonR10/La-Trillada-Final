using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProyectoFinal.Models;
using ReglasNegocio.DTO_Entities;
using ReglasNegocio.Entities;
using System.Runtime.CompilerServices;

namespace ProyectoFinal.Controllers
{
    public class ProductoController : Controller
    {
        private readonly BarContext _db;

        public ProductoController(BarContext context)
        {
            _db = context;
        }

        public IActionResult Index()
        {
            var tiposProducto = _db.TipoProductos.ToList(); // Obtener tipos de productos desde la base de datos
            ViewBag.TiposProducto = tiposProducto; // Asignar tipos de producto a ViewBag
            return View();
        }

        [HttpPost("CreateProducto")]
        public async Task<IActionResult> Create([FromBody] DTO_Producto prod) {
            try
            {
                Producto producto = new Producto(prod);
                _db.Productos.Add(producto);
                await _db.SaveChangesAsync();
                return Ok("Alta exitosa");
            }
            catch (Exception ex)
            {
                return BadRequest(ex);              
            }           
        }
    }
}
