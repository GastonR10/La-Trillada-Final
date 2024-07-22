using ReglasNegocio.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ReglasNegocio.DTO_Entities
{
    public class DTO_Cliente
    {
    
        private int Id { get; set; }
        private string NombreUsuario { get; set; }
        private string Password { get; set; }
        private string Nombre { get; set; }
        private string Apellido { get; set; }
        private string Email { get; set; }
        private string Telefono { get; set; }
        private string Direccion { get; set; }
        private List<DTO_Pedido> Pedidos { get; set; }

        public DTO_Cliente(string nombreUsuario, string password, string nombre, string apellido, string email, string telefono, string direccion, List<DTO_Pedido> pedidos)
        {
            NombreUsuario = nombreUsuario;
            Password = password;
            Nombre = nombre;
            Apellido = apellido;
            Email = email;
            Telefono = telefono;
            Direccion = direccion;
            Pedidos = pedidos;
        }

        //public DTO_Cliente(Usuario c) { }
    }
}
