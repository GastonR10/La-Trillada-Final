using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProyectoFinal.Models;
using ReglasNegocio.DTO_Entities;
using ReglasNegocio.Entities;

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
                if (string.IsNullOrWhiteSpace(expDTO.Comentario))
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

                return Ok();
            }
            catch (Exception ex)
            {
                await _errorLogger.LogErrorAsync($"{DateTime.Now}: {ex.Message} \n {ex.StackTrace} \n\n");
                return StatusCode(500);
            }
        }
    }
}
