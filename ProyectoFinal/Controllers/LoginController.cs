using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.VisualStudio.Web.CodeGenerators.Mvc.Templates.BlazorIdentity.Pages.Manage;
using ProyectoFinal.Models;
using ReglasNegocio.DTO_Entities;
using ReglasNegocio.Entities;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace ProyectoFinal.Controllers
{
    public class LoginController : Controller
    {
        private readonly BarContext _db;

        public LoginController(BarContext context)
        {
            _db = context;
        }

        public IActionResult Login()
        {
            return View();
        }

        [HttpPost("Ingresar")]
        public async Task<IActionResult> Ingresar([FromBody] DTO_Usuario usuario)
        {
            try
            {
                var user = _db.Usuarios
                                .Where(u => u.NombreUsuario == usuario.NombreUsuario && u.Password == usuario.Password)
                                .FirstOrDefault();

                if (user != null)
                {
                    HttpContext.Session.SetString("rol", user.rol);
                    HttpContext.Session.SetString("Usuario", user.NombreUsuario);

                    // Verificar el rol del usuario
                    if (user.rol == "Admin")
                    {
                        return Ok(new { redirectUrl = Url.Action("CreateProducto", "Producto") });
                    }
                    else if (user.rol == "Cliente")
                    {
                        return Ok(new { redirectUrl = Url.Action("GetProductos", "Producto") });
                    }

                    // Si por alguna razón no es ni Admin ni Cliente, manejarlo adecuadamente
                    return BadRequest();
                }
                else
                {
                    return NotFound();
                }
            }
            catch (Exception ex)
            {
                return BadRequest(ex);
            }
        }

        public ActionResult Logout()
        {
            HttpContext.Session.Clear();
            return RedirectToAction(nameof(Login));
        }

        public IActionResult Registro()
        {
            return View();
        }
        public IActionResult RegistroAdmin()
        {
            return View();
        }

        [HttpPost("AltaUsuario")]
        public async Task<IActionResult> AltaUsuario([FromBody] DTO_Usuario usuario)
        {
            try
            {
                // Verificar si el usuario ya existe en la base de datos
                Usuario? existingUser = await _db.Usuarios
                    .FirstOrDefaultAsync(u => u.NombreUsuario == usuario.NombreUsuario);

                if (existingUser != null)
                {
                    // Si el usuario ya existe, retornar un BadRequest
                    return BadRequest("El nombre de usuario ya existe.");
                }

                // Crear el nuevo usuario con rol "Admin"
                Usuario newUser = new Usuario
                {
                    NombreUsuario = usuario.NombreUsuario,
                    Password = usuario.Password,
                    rol = "Admin"
                };

                // Guardar el nuevo usuario en la base de datos
                _db.Usuarios.Add(newUser);
                await _db.SaveChangesAsync();

                // Retornar una respuesta exitosa
                return Ok(newUser);
            }
            catch (Exception)
            {

                return StatusCode(500);
            }

        }

        [HttpPost("AltaAdmin")]
        public async Task<IActionResult> AltaAdmin([FromBody] DTO_Usuario usuario)
        {
            try
            {
                // Verificar si el usuario ya existe en la base de datos
                Usuario? existingUser = await _db.Usuarios
                    .FirstOrDefaultAsync(u => u.NombreUsuario == usuario.NombreUsuario);

                if (existingUser != null)
                {
                    // Si el usuario ya existe, retornar un BadRequest
                    return BadRequest();
                }

                // Crear el nuevo usuario con rol "Admin"
                Usuario newUser = new Usuario(usuario.NombreUsuario, usuario.Password, "Admin");

                // Guardar el nuevo usuario en la base de datos
                _db.Usuarios.Add(newUser);
                await _db.SaveChangesAsync();

                // Retornar una respuesta exitosa
                return Ok();
            }
            catch (Exception)
            {

                return StatusCode(500);
            }

        }

        [HttpPost("AltaCliente")]
        public async Task<IActionResult> AltaCliente([FromBody] DTO_Usuario usuario)
        {
            try
            {
                // Verificar si el usuario ya existe en la base de datos
                Usuario? existingUser = await _db.Usuarios
                    .FirstOrDefaultAsync(u => u.NombreUsuario == usuario.NombreUsuario);

                if (existingUser != null)
                {
                    // Si el usuario ya existe, retornar un BadRequest con un mensaje
                    return BadRequest("El usuario ya existe.");
                }

                // Crear el nuevo usuario con rol "Cliente"
                Usuario newUser = new Usuario(usuario.NombreUsuario, usuario.Password, "Cliente", usuario.Nombre, usuario.Apellido, usuario.Email, usuario.Telefono, usuario.Direccion);       

                // Guardar el nuevo usuario en la base de datos
                _db.Usuarios.Add(newUser);
                await _db.SaveChangesAsync();

                // Retornar una respuesta exitosa con el nuevo usuario
                return Ok(newUser);
            }
            catch (Exception ex)
            {
                // Retornar un error 500 con un mensaje de error
                return StatusCode(500, $"Error interno del servidor: {ex.Message}");
            }
        }

        public IActionResult DatosPersonales()
        {
            return View();
        }

        [HttpGet("ObtenerUsuario")]
        public async Task<IActionResult> ObtenerUsuario()
        {
            try
            {
                // Verificar si el usuario ya existe en la base de datos
                Usuario? us = await _db.Usuarios
                    .FirstOrDefaultAsync(u => u.NombreUsuario == HttpContext.Session.GetString("Usuario"));

                if (us == null)
                {
                    // Si el usuario ya existe, retornar un BadRequest con un mensaje
                    return BadRequest("El usuario no existe.");
                }

                DTO_Usuario UsuarioRetorno = new DTO_Usuario("", "", "",us.Nombre, us.Apellido, us.Email, us.Telefono, us.Direccion);
                return Ok(UsuarioRetorno);
            }
            catch (Exception ex)
            {
                // Retornar un error 500 con un mensaje de error
                return StatusCode(500, $"Error interno del servidor: {ex.Message}");
            }
        }

        [HttpPost("EditarCliente")]
        public async Task<IActionResult> EditarCliente([FromBody] DTO_Usuario usuario)
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

                // Actualizar los campos del usuario existente con los nuevos datos
                existingUser.Nombre = usuario.Nombre;
                existingUser.Apellido = usuario.Apellido;
                existingUser.Email = usuario.Email;
                existingUser.Telefono = usuario.Telefono;
                existingUser.Direccion = usuario.Direccion;

                // Guardar los cambios en la base de datos
                _db.Usuarios.Update(existingUser);
                await _db.SaveChangesAsync();

                // Retornar una respuesta exitosa con el usuario actualizado
                return Ok();

            }
            catch (Exception ex)
            {
                // Retornar un error 500 con un mensaje de error
                return StatusCode(500, $"Error interno del servidor: {ex.Message}");
            }
        }

    }





}
