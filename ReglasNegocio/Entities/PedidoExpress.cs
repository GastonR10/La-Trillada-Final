using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ReglasNegocio.Entities
{
    public class PedidoExpress: Pedido
    {
        public string Email {  get; set; }
        public string Telefono { get; set; }
        public string Direccion { get; set; }
        public string Nombre { get; set;}

        public PedidoExpress(string comentario, Carrito carrito, int idMesa, string email, string telefono, string direccion, string nombre)
          : base(comentario, carrito, idMesa)
        {
            Email = email;
            Telefono = telefono;    
            Direccion = direccion;  
            Nombre = nombre;
        }

    }
}
