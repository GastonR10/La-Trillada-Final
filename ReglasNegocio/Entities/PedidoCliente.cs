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
        public Usuario Cliente { get; set; }
        public PedidoCliente() : base() { }
        public PedidoCliente(string comentario, Carrito carrito,int idMesa, bool pos, Usuario cliente)
            : base(comentario, carrito, idMesa, pos)
        {
            Cliente = cliente;
        }

    }
}
