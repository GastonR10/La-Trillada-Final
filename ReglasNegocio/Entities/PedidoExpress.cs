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
        public string Nombre { get; set;}

        public PedidoExpress() : base() { }

        public PedidoExpress(string comentario, int idCarrito, int idMesa, bool pos, string dir, string email, string telefono, string nombre)
          : base(comentario, idCarrito, idMesa, pos, dir)
        {
            Email = email;
            Telefono = telefono;    
            Nombre = nombre;
        }

    }
}
