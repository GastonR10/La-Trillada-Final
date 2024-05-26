using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ReglasNegocio.Entities
{
    public class Carrito
    {
        [Key]
        public int Id { get; set; }
        public List<ProductoCantidad> CantidadesProductos { get; set; }
        public decimal PrecioTotal { get; set; }

        // Constructor por defecto
        public Carrito() { }
        public Carrito(List<ProductoCantidad> cantidadesProductos, decimal precioTotal)
        {            
            CantidadesProductos = cantidadesProductos;
            PrecioTotal = precioTotal;
        }

    }
}
