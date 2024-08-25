using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProyectoFinal.Models;
using ReglasNegocio.DTO_Entities;
using ReglasNegocio.Entities;
using static ReglasNegocio.Enums;

namespace ProyectoFinal.Controllers
{
    public class ExperienciaController : Controller
    {
        private readonly BarContext _context;
        private readonly ErrorLogger _errorLogger;

        public ExperienciaController(BarContext context, ErrorLogger errorLogger)
        {
            _context = context;
            _errorLogger = errorLogger;
        }
        public IActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] DTO_Experiencia expDTO)
        {
            try
            {
                if (expDTO.Calificacion < 0 || expDTO.Calificacion > 10)
                {
                    return BadRequest("Calificación debe estar entre 0 y 10.");
                }
                if (expDTO.Comentario == null)
                {
                    return BadRequest("Ingrese comentario válido.");
                }
                if (expDTO.Comentario.Length > 500)
                {
                    return BadRequest("Elcomentario puede tener un máximo de 500 caracteres.");
                }

                // Verificar si el usuario ya existe en la base de datos
                Usuario? existingUser = await _context.Usuarios
                                                .FirstOrDefaultAsync(u => u.NombreUsuario == HttpContext.Session.GetString("Usuario"));
                
                if (existingUser == null)
                {
                    return BadRequest("El usuario no existe.");
                }

                Experiencia exp = new Experiencia(expDTO);
                exp.NombreUsuario = existingUser.NombreUsuario;

                _context.Experiencias.Add(exp);
                await _context.SaveChangesAsync();

                return Ok("nueva exp");
            }
            catch (Exception ex)
            {
                await _errorLogger.LogErrorAsync($"{DateTime.Now}: {ex.Message} \n {ex.StackTrace}; \n\n");
                return StatusCode(500);
            }
        }

        public IActionResult GetComentarios()
        {
            return View();
        }

        [HttpPost]
        public async Task<IActionResult> GetComentariosList([FromBody] DTO_ExperienciaFiltrar filtro)
        {
            try
            {
                var query = _context.Experiencias.AsQueryable();

                if(filtro != null)
                {
                    if (filtro.FechaInicio.HasValue)
                    {
                        query = query.Where(e => e.Fecha >= filtro.FechaInicio.Value);
                    }

                    if (filtro.FechaFin.HasValue)
                    {
                        query = query.Where(e => e.Fecha <= filtro.FechaFin.Value);
                    }

                    if (filtro.Calificacion.HasValue)
                    {
                        query = query.Where(e => e.Calificacion == filtro.Calificacion.Value);
                    }
                }                

                var comentarios = await query.ToListAsync();

                return Json(comentarios);
            }
            catch (Exception ex)
            {
                await _errorLogger.LogErrorAsync($"{DateTime.Now}: {ex.Message} \n {ex.StackTrace}; \n\n");
                return StatusCode(500, "Error al obtener los comentarios");
            }
        }


        [HttpGet]
        public async Task<IActionResult> ObtenerExperiencias()
        {
            try
            {
                // Obtener el primer y último día del año actual
                DateTime inicioAnio = new DateTime(DateTime.Now.Year, 1, 1);
                DateTime finAnio = new DateTime(DateTime.Now.Year, 12, 31);

                // Filtrar las experiencias del año actual
                List<DTO_Experiencia> experienciasAnioActual = await _context.Experiencias
                    .Where(e => e.Fecha >= inicioAnio && e.Fecha <= finAnio)
                     .Select(e => new DTO_Experiencia(e))
                    .ToListAsync();


                // Seleccionar hasta 20 experiencias aleatorias
                var experienciasRandom = experienciasAnioActual
                    .OrderBy(x => Guid.NewGuid())
                    .Take(20)
                    .ToList();

                return Ok(experienciasRandom);

            }
            catch (Exception ex)
            {
                await _errorLogger.LogErrorAsync($"{DateTime.Now}: {ex.Message} \n {ex.StackTrace}; \n\n");
                return StatusCode(500);
            }

        }

    }
}
