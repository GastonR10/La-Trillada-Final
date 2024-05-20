using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ReglasNegocio.Entities
{
    public class Pedido
    {
     
        public int Id { get; set; }
        public string Comentario { get; set; }
        public string Estado { get; set; }
        public bool Aceptado { get; set; }
        public int IdCarrito { get; set; }
        public Carrito Carrito { get; set; }
        public int IdMesa { get; set; }

        public DateTime Fecha { get; set; }

        public Pedido(string comentario, string estado, bool aceptado, int idCarrito, int idMesa, DateTime fecha)
        {            
            Comentario = comentario;
            Estado = estado;
            Aceptado = aceptado;
            IdCarrito = idCarrito;
            IdMesa = idMesa;
            Fecha = DateTime.Now;  
        }

        
    }
}
