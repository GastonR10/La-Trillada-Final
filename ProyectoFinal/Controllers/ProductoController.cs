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
            return View();
        }

        [HttpPost("CreateProducto")]
        public async Task<IActionResult> Create([FromBody] DTO_Producto prod) {
            try
            {
                Producto producto = new Producto(prod);
                _db.Productos.Add(producto);
                _db.SaveChanges();
                return Ok("Alta exitosa");
            }
            catch (Exception ex)
            {
                return BadRequest(ex);              
            }           
        }
    }
}
