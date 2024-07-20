using ReglasNegocio.DTO_Entities;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ReglasNegocio.Entities
{
    public class ProductoCantidad
    {
        [Key]
        public int Id { get; set; }
        [ForeignKey(nameof(Producto))]
        public int IdProducto { get; set; }
        public Producto? Producto { get; set; }
        public int Cantidad { get; set; }
        [ForeignKey(nameof(Carrito))]
        [Column("CarritoId")]
        public int IdCarrito { get; set; }
        public Carrito? Carrito { get; set; }
        public string? Comentario { get; set; }

        public ProductoCantidad() { 
            
        }
        public ProductoCantidad(int idProducto, int cantidad, int idCarrito)
        {           
            IdProducto = idProducto;
            Cantidad = cantidad;
            IdCarrito = idCarrito;
        }

        public ProductoCantidad(DTO_ProductoCantidad pc)
        {
            IdProducto = pc.IdProducto;
            Cantidad = pc.Cantidad;
            Comentario = pc.Comentario;
        }

    }
}
