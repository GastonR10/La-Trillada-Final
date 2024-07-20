using ReglasNegocio.Entities;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ReglasNegocio.DTO_Entities
{
    public class DTO_Pedido
    {
        public int Id { get; set; }

        public string? Comentario { get; set; }

        public string Estado { get; set; }

        public bool Aceptado { get; set; }

        public int IdCarrito { get; set; }

        public DTO_Carrito Carrito { get; set; }

        public int? IdMesa { get; set; }

        public string Direccion { get; set; }

        public DateTime Fecha { get; set; }

        public bool Pos { get; set; }

        public DTO_Pedido(int id,string comentario, Enums.Estado estado, bool aceptado, DTO_Carrito carrito, int idMesa, bool pos, string dir, DateTime fecha)
        {
            Id = id;
            Comentario = comentario;
            Estado = estado.ToString() ;
            Aceptado = aceptado;
            Carrito = carrito;
            IdMesa = idMesa;       
            Fecha = fecha;
            Pos = pos;

        }

        public DTO_Pedido()
        { //cambiar a public si me explota entity framework
            Id = 0;
            Comentario = null;
            Estado = "";
            Aceptado = false;
            IdCarrito = 0;
            Carrito = null!;
            IdMesa = 0;
            Direccion = "";            
            Pos = false;
        }

        public DTO_Pedido(Pedido pd)
        {
            Id = pd.Id;
            Comentario = pd.Comentario;
            Estado = pd.Estado.ToString();
            Aceptado = pd.Aceptado;
            IdCarrito = pd.IdCarrito;
            //Carrito = new DTO_Carrito( pd.Carrito);
            IdMesa = pd.IdMesa;
            Direccion = pd.Direccion;
            Pos = pd.Pos;
        }

    }
}
