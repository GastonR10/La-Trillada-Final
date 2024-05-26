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

        public string Estado { get; set; }// hacer enum para estado.

        public bool Aceptado { get; set; }

        [ForeignKey(nameof(Carrito))]//definir FK
        public int IdCarrito { get; set; }

        public Carrito Carrito { get; set; }

        [ForeignKey(nameof(Mesa))]
        public int IdMesa { get; set; }

        public DateTime Fecha { get; set; }

        private Pedido() { //cambiar a public si me explota entity framework
            Id = 0;
            Comentario = null;
            //Estado = Enums.Estados.Pendiente;
            Aceptado = false;
            IdCarrito = 0;
            Carrito = null!;
            IdMesa = 0;
            Fecha = DateTime.Now;
        }
        
        public Pedido(string? comentario, Carrito carrito, int idMesa): this() 
        {            
            Comentario = comentario;
            Carrito = carrito;
            IdMesa = idMesa;
        }

        
    }
}
