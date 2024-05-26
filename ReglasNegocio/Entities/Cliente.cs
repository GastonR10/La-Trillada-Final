using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ReglasNegocio.Entities
{
    public class Cliente: Usuario
    {
        public string Nombre { get; set; }
        public string Apellido { get; set; }
        public string Email { get; set; }
        public string Telefono { get; set; }
        public string Direccion {  get; set; }
        public List<PedidoCliente> Pedidos { get; set; } = new List<PedidoCliente>();

        public Cliente() { }    
        public Cliente(string nombreUsuario, string password, string nombre, string apellido, string email, string telefono, string direccion)
           : base(nombreUsuario, password)
        {
            Nombre = nombre;
            Apellido = apellido;
            Email = email;
            Telefono = telefono;
            Direccion = direccion;
        }
    }
}
