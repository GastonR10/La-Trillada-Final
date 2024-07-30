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
        public string Email { get; set; }
        public string Telefono { get; set; }
        public string Nombre { get; set; }

        public DTO_PedidoExpress(int id, string comentario, Enums.Estado estado, bool aceptado, DTO_Carrito carrito, int idMesa, bool pos, string dir, DateTime fecha, string email, string telefono, string direccion, string nombre)
        : base(id, comentario, estado, aceptado, carrito, idMesa, pos, dir, fecha)
        {
            Email = email;
            Telefono = telefono;
            Nombre = nombre;
        }

        public DTO_PedidoExpress(PedidoExpress p)
        {
            Id = p.Id;
            Comentario = p.Comentario;
            Estado = p.Estado.ToString();
            Aceptado = p.Aceptado;
            if(p.Carrito != null)
            {
                Carrito = new DTO_Carrito(p.Carrito);
            } else
            {
                Carrito = null;
            }
            
            IdMesa = p.IdMesa;
            Pos = p.Pos;
            Direccion = p.Direccion;
            Fecha = p.Fecha;
            Email = p.Email;
            Telefono = p.Telefono;
            Nombre = p.Nombre;
        }
    }
}
