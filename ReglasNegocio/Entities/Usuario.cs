using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace ReglasNegocio.Entities
{
    public class Usuario
    {
        [Key]
        public int Id { get; set; }
        public string NombreUsuario { get; set; }
        public string Password { get; set; }
        public string rol { get; set; }
        public string Nombre { get; set; }
        public string Apellido { get; set; }
        public string Email { get; set; }
        public string Telefono { get; set; }
        public string Direccion { get; set; }
        public List<PedidoCliente> Pedidos { get; set; } = new List<PedidoCliente>();
        public Usuario() { }
        public Usuario(string nombreUsuario, string password, string rol, string nombre, string apellido, string email, string telefono, string direccion)
        {
            NombreUsuario = nombreUsuario;
            Password = password;
            this.rol = rol;

            if (rol == "cliente")
            {
                Nombre = nombre;
                Apellido = apellido;
                Email = email;
                Telefono = telefono;
                Direccion = direccion;
            }
            else if (rol == "admin")
            {
                Nombre = null;
                Apellido = null;
                Email = null;
                Telefono = null;
                Direccion = null;
            }
        }


    }
}
