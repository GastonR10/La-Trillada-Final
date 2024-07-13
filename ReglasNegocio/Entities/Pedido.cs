using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ReglasNegocio.Entities
{
    public abstract class Pedido
    {

        [Key]
        public int Id { get; set; }

        public string? Comentario { get; set; }

        public Enums.Estado Estado { get; set; }// hacer enum para estado.

        public bool Aceptado { get; set; }

        [ForeignKey(nameof(Carrito))]//definir FK
        public int IdCarrito { get; set; }

        public Carrito Carrito { get; set; }

        [ForeignKey(nameof(Mesa))]
        public int? IdMesa { get; set; }

        public string Direccion { get; set; }

        public DateTime Fecha { get; set; }

        public bool Pos {  get; set; }

        public Pedido() { //cambiar a public si me explota entity framework
            Id = 0;
            Comentario = null;
            Estado = Enums.Estado.Pendiente;
            Aceptado = false;
            IdCarrito = 0;
            Carrito = null!;
            IdMesa = 0;
            Direccion = "";
            Fecha = DateTime.Now;
            Pos = false;
        }
        
        public Pedido(string? comentario, int idCarrito, int idMesa, bool pos, string dir): this() 
        {            
            Comentario = comentario;
            IdCarrito = idCarrito;
            IdMesa = idMesa;
            Pos = pos;  
            Direccion = dir;
        }

        
    }
}
