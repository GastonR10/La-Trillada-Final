using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProyectoFinal.Models;
using ReglasNegocio.DTO_Entities;
using ReglasNegocio.Entities;

namespace ProyectoFinal.Controllers
{
    public class LoginController : Controller
    {
        private readonly BarContext _db;

        public LoginController(BarContext context)
        {
            _db = context;
        }

        [HttpGet("AltaUsuario")]
        public IActionResult Login(DTO_Usuario usuario) {
            //no me deja usar Usuario xq es abstracta.. ver eso NACHITO.
            var user = _db.Usuarios
                               .Where(u => u.NombreUsuario == usuario.NombreUsuario && u.Password == usuario.Password)
                               .FirstOrDefault();

            if (user != null)
            {
                HttpContext.Session.SetString("rol", user.rol);

                // Verificar el rol del usuario
                if (user.rol == "Admin")
                {
                    // Usuario es un admin
                    return View("AdminHome", user as Usuario);
                }
                else if (user.rol == "Cliente")
                {
                    // Usuario es un cliente
                    return View("ClienteHome", user as Usuario);
                }

                // Si por alguna razón no es ni Admin ni Cliente, manejarlo adecuadamente
                return View("Error");
            }
            else
            {
                // Usuario no encontrado, retorna un error o una vista indicando que no se encontró.,
                // si no encontro, retornar notfound y comunicar msj de error.
                return View("UsuarioNoEncontrado");
            }
          
        }

        //public IActionResult Logout() { 
        //    return View();
        //}

        public IActionResult Registro()
        {
            return View(); 
        }
    }
}
