using ReglasNegocio.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ReglasNegocio.DTO_Entities
{
    public class DTO_Pedido
    {
        private int Id { get; set; }
        private string Comentario { get; set; }
        private string Estado { get; set; }
        private bool Aceptado { get; set; }
        private DTO_Carrito Carrito { get; set; }
        private int IdMesa { get; set; }
        private DateTime Fecha { get; set; }

        public DTO_Pedido(int id,string comentario, string estado, bool aceptado, DTO_Carrito carrito, int idMesa, DateTime fecha)
        {
            Id = id;
            Comentario = comentario;
            Estado = estado;
            Aceptado = aceptado;
            Carrito = carrito;
            IdMesa = idMesa;
            Fecha = DateTime.Now;
        }
    }
}
