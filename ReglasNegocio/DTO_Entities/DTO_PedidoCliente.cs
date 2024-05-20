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
        private int IdCliente { get; set; }

        public DTO_PedidoCliente(int id, string comentario, string estado, bool aceptado, DTO_Carrito carrito, int idMesa, DateTime fecha, int idCliente)
            : base(id, comentario, estado, aceptado, carrito, idMesa, fecha)
        {
            IdCliente = idCliente;
        }
    }
}
