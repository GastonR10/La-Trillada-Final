using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProyectoFinal.Models;
using ReglasNegocio.DTO_Entities;
using ReglasNegocio.Entities;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;


namespace ProyectoFinal.Controllers
{
    public class LoginController : Controller
    {
        private readonly BarContext _db;
        private readonly Validaciones _validaciones;
        private readonly ErrorLogger _errorLogger;

        public LoginController(BarContext context, Validaciones val, ErrorLogger errorLogger)
        {
            _db = context;
            _validaciones = val;
            _errorLogger = errorLogger;
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
                Usuario? user = await _db.Usuarios
                                .Where(u => u.NombreUsuario == usuario.NombreUsuario)
                                .FirstOrDefaultAsync();

                if (user != null)
                {
                    PasswordHasher<Usuario> passwordHasher = new PasswordHasher<Usuario>();
                    PasswordVerificationResult verificationResult = passwordHasher.VerifyHashedPassword(null, user.Password, usuario.Password);

                    if (verificationResult == PasswordVerificationResult.Success)
                    {
                        HttpContext.Session.SetString("rol", user.rol);
                        HttpContext.Session.SetString("Usuario", user.NombreUsuario);

                        var claims = new List<Claim>
                        {
                            new(ClaimTypes.Name, user.NombreUsuario),
                            new Claim("rol", user.rol)
                        };

                        var claimsIdentity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);


                        // Crear propiedades de autenticación
                        var authProperties = new AuthenticationProperties
                        {
                            IsPersistent = true, // Configurar como verdadero si deseas una cookie persistente
                        };

                        // Iniciar sesión del usuario
                        await HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, new ClaimsPrincipal(claimsIdentity), authProperties);

                        // Verificar el rol del usuario
                        if (user.rol == "Admin")
                        {
                            return Ok(new { redirectUrl = Url.Action("AdministracionPedidos", "Pedido") });
                        }
                        else if (user.rol == "Cliente")
                        {
                            return Ok(new { redirectUrl = Url.Action("GetProductos", "Producto") });
                        }

                        // Si por alguna razón no es ni Admin ni Cliente, manejarlo adecuadamente
                        return NotFound("Hay un problema con el tipo de usuario, contactar administrador");
                    }

                    return NotFound("Credenciales incorrectas.");
                }

                return NotFound("Usuario no existe.");
            }
            catch (Exception ex)
            {
                await _errorLogger.LogErrorAsync($"{DateTime.Now}: {ex.Message} \n {ex.StackTrace}; \n\n");
                return StatusCode(500);
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

        [Authorize(Policy = "AdminOnly")]
        public IActionResult RegistroAdmin()
        {
            return View();
        }

        [HttpPost("AltaAdmin")]
        public async Task<IActionResult> AltaAdmin([FromBody] DTO_Usuario usuario)
        {
            try
            {
                if (usuario.NombreUsuario == "" || !_validaciones.EsContrasenaValida(usuario.Password))
                {
                    return BadRequest("No todos los datos son correctos.");
                }

                Usuario? existingUser = await _db.Usuarios
                    .FirstOrDefaultAsync(u => u.NombreUsuario == usuario.NombreUsuario);

                if (existingUser != null)
                {
                    return BadRequest("Nombre de usuario ya se está usando.");
                }

                // Hashear la contraseña antes de guardarla
                PasswordHasher<Usuario> passwordHasher = new PasswordHasher<Usuario>();
                string hashedPassword = passwordHasher.HashPassword(null, usuario.Password);

                // Crear el nuevo usuario con rol "Admin"
                Usuario newUser = new Usuario(usuario.NombreUsuario, hashedPassword, "Admin");

                _db.Usuarios.Add(newUser);
                await _db.SaveChangesAsync();

                return Ok();
            }
            catch (Exception ex)
            {
                await _errorLogger.LogErrorAsync($"{DateTime.Now}: {ex.Message} \n {ex.StackTrace}; \n\n");
                return StatusCode(500);
            }

        }

        [HttpPost("AltaCliente")]
        public async Task<IActionResult> AltaCliente([FromBody] DTO_Usuario usuario)
        {
            try
            {
                if (
                    usuario.Nombre == "" ||
                    usuario.Apellido == "" ||
                    usuario.NombreUsuario == "" ||
                    !_validaciones.EsContrasenaValida(usuario.Password) ||
                    usuario.Email == null ||
                    !_validaciones.EsEmailValido(usuario.Email) ||
                    usuario.Telefono == null ||
                    !_validaciones.EsNumeroValido(usuario.Telefono) ||
                    usuario.Direccion == ""
                    )
                {
                    return BadRequest("No todos los datos son correctos.");
                }

                Usuario? existingUser = await _db.Usuarios
                    .FirstOrDefaultAsync(u => u.NombreUsuario == usuario.NombreUsuario);

                if (existingUser != null)
                {
                    return BadRequest("Nombre de usuario ya se está usando.");
                }

                // Hashear la contraseña antes de guardarla
                PasswordHasher<Usuario> passwordHasher = new PasswordHasher<Usuario>();
                string hashedPassword = passwordHasher.HashPassword(null, usuario.Password);

                // Crear el nuevo usuario con rol "Cliente"
                Usuario newUser = new Usuario(usuario.NombreUsuario, hashedPassword, "Cliente", usuario.Nombre, usuario.Apellido, usuario.Email, usuario.Telefono, usuario.Direccion);

                _db.Usuarios.Add(newUser);
                await _db.SaveChangesAsync();

                return Ok(newUser);
            }
            catch (Exception ex)
            {
                await _errorLogger.LogErrorAsync($"{DateTime.Now}: {ex.Message} \n {ex.StackTrace}; \n\n");
                return StatusCode(500);
            }
        }

        [Authorize(Policy = "ClienteOnly")]
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
                    return BadRequest("Usuario no encontrado.");
                }

                DTO_Usuario UsuarioRetorno = new DTO_Usuario("", "", "", us.Nombre, us.Apellido, us.Email, us.Telefono, us.Direccion);
                return Ok(UsuarioRetorno);
            }
            catch (Exception ex)
            {
                await _errorLogger.LogErrorAsync($"{DateTime.Now}: {ex.Message} \n {ex.StackTrace}; \n\n");
                return StatusCode(500);
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
                    return BadRequest();
                }

                if (
                    usuario.Nombre == "" ||
                    usuario.Apellido == "" ||
                    !_validaciones.EsEmailValido(usuario.Email) ||
                    !_validaciones.EsNumeroValido(usuario.Telefono) ||
                    usuario.Direccion == ""
                    )
                {
                    return BadRequest("No todos los datos son correctos.");
                }
                else
                {

                    existingUser.Nombre = usuario.Nombre;
                    existingUser.Apellido = usuario.Apellido;
                    existingUser.Email = usuario.Email;
                    existingUser.Telefono = usuario.Telefono;
                    existingUser.Direccion = usuario.Direccion;

                    _db.Usuarios.Update(existingUser);
                    await _db.SaveChangesAsync();

                    return Ok();
                }

            }
            catch (Exception ex)
            {
                await _errorLogger.LogErrorAsync($"{DateTime.Now}: {ex.Message} \n {ex.StackTrace}; \n\n");
                return StatusCode(500);
            }
        }

    }





}
