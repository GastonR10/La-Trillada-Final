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
        public int IdProducto { get; set;}
        public Producto Producto { get; set; }
        public int Cantidad { get; set; }

        public ProductoCantidad() { }   
        public ProductoCantidad(Producto producto, int cantidad)
        {            
            Producto = producto;
            Cantidad = cantidad;
        }
    }
}
