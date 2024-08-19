﻿using Microsoft.AspNetCore.Mvc;
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
                List<DTO_TipoProducto> tiposProducto = await _context.TipoProductos
                    .OrderBy(x => x.Orden)
                    .Select(tp => new DTO_TipoProducto(tp)).ToListAsync();

                return Json(tiposProducto);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet]
        public IActionResult GetTipoProductosView()
        {
            return View("TipoProductos");
        }

        [HttpPost]
        public async Task<IActionResult> OrdenarTipos([FromBody] List<DTO_TipoProducto> tipos)
        {
            try
            {
                foreach (DTO_TipoProducto tipo in tipos)
                {
                    TipoProducto? tipoBD = await _context.TipoProductos.FindAsync(tipo.Id);
                    if (tipoBD == null) return NotFound($"No existe el tipoProducto con id: {tipo.Id}");

                    tipoBD.Orden = tipo.Orden;

                }

                await _context.SaveChangesAsync();

                return Ok();
            }
            catch (Exception ex)
            {
                return StatusCode(500);
            }

        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] DTO_TipoProducto tipoDTO)
        {
            try
            {
                if (tipoDTO.Descripcion == "" || tipoDTO.Descripcion == null)
                {
                    return BadRequest("Ingrese un nombre para el tipo de producto.");
                }

                TipoProducto tipo = new TipoProducto(tipoDTO.Descripcion);                
                _context.TipoProductos.Add(tipo);
                await _context.SaveChangesAsync();
                tipo.Orden = tipo.Id;
                await _context.SaveChangesAsync();
                return Ok();
            }
            catch (Exception ex)
            {
                return StatusCode(500);
            }            
        }
    }
}