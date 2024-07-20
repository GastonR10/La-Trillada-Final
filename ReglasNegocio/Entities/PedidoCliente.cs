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
        public PedidoCliente(string comentario, int idCarrito,int idMesa, bool pos, string dir, int clienteId)
            : base(comentario, idCarrito, idMesa, pos, dir)
        {
            ClienteId = clienteId;
        }

    }
}
