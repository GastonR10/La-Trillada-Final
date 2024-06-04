using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using ProyectoFinal.Models;
using ReglasNegocio.DTO_Entities;
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
            try
            {
                var tiposProducto = await _context.TipoProductos
                    .Select(tp => new DTO_TipoProducto
                    {
                        Id = tp.Id,
                        Descripcion = tp.Descripcion
                    }).ToListAsync();

                return Json(tiposProducto);
            }
            catch (Exception ex)
            {
               return BadRequest(ex.Message);   
            }
        }

    }
}