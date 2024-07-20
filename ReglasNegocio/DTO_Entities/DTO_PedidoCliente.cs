using ReglasNegocio.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ReglasNegocio.DTO_Entities
{
    public class DTO_PedidoCliente: DTO_Pedido
    {
        public int ClienteId { get; set; }
        public DTO_Usuario Cliente { get; set; }

        public DTO_PedidoCliente(int id, string comentario, Enums.Estado estado, bool aceptado, DTO_Carrito carrito, int idMesa, bool pos, string dir, DateTime fecha, int idCliente, DTO_Usuario Cliente)
            : base(id, comentario, estado, aceptado, carrito, idMesa, pos, dir, fecha)
        {
            ClienteId = idCliente;
        }
    }
}
