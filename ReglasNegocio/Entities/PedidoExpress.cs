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

        public PedidoExpress(string comentario, string estado, bool aceptado, int idCarrito, int idMesa, DateTime fecha, string email, string telefono, string direccion, string nombre)
          : base(comentario, estado, aceptado, idCarrito, idMesa, fecha)
        {
            Email = email;
            Telefono = telefono;    
            Direccion = direccion;  
            Nombre = nombre;
        }

    }
}
