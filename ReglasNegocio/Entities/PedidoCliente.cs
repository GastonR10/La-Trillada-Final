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
        public PedidoCliente(string comentario, Carrito carrito,int idMesa,int idCliente)
            : base(comentario, carrito, idMesa)
        {
            IdCliente = idCliente;
        }

    }
}
