using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using ProyectoFinal.Models;
using ReglasNegocio.Entities;

namespace ProyectoFinal.Controllers
{
    public class TipoProductoController : Controller
    {
        private readonly BarContext _context;

        public TipoProductoController(BarContext context)
        {
            _context = context;
        }

        // Método para obtener la lista de tipos de productos
        [HttpGet]
        public async Task<IActionResult> GetTiposProducto()
        {
            var tiposProducto = await _context.TipoProductos.ToListAsync();
            return Json(tiposProducto);
        }

    }
}