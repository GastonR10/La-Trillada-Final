using ReglasNegocio.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ReglasNegocio.DTO_Entities
{
    public class DTO_PedidoExpress: DTO_Pedido
    {
        private string Email { get; set; }
        private string Telefono { get; set; }
        private string Direccion { get; set; }
        private string Nombre { get; set; }

        public DTO_PedidoExpress(int id, string comentario, string estado, bool aceptado, DTO_Carrito carrito, int idMesa, string email, string telefono, string direccion, string nombre)
        : base(id, comentario, estado, aceptado, carrito, idMesa)
        {
            Email = email;
            Telefono = telefono;
            Direccion = direccion;
            Nombre = nombre;
        }


    }
}
