using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ReglasNegocio.Entities
{
    public class PedidoCliente : Pedido
    {
        [ForeignKey(nameof(Cliente))]
        public int ClienteId {  get; set; }
        public Cliente Cliente { get; set; }

        public PedidoCliente() : base() { }
        public PedidoCliente(string comentario, Carrito carrito,int idMesa,Cliente cliente)
            : base(comentario, carrito, idMesa)
        {
            Cliente = cliente;
        }

    }
}
