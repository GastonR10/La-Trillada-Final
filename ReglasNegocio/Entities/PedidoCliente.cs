using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ReglasNegocio.Entities
{
    public class PedidoCliente : Pedido
    {
        public int IdCliente {  get; set; }
        public Cliente Cliente { get; set; }
        public PedidoCliente(string comentario, string estado, bool aceptado, int idCarrito, int idMesa, DateTime fecha, int idCliente)
            : base(comentario, estado, aceptado, idCarrito, idMesa, fecha)
        {
            IdCliente = idCliente;
        }

    }
}
