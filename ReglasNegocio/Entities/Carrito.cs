using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ReglasNegocio.Entities
{
    public class Carrito
    {

        public int Id { get; set; }
        public List<ProductoCantidad> CantidadesProductos { get; set; }
        public decimal PrecioTotal { get; set; }

        public Carrito(List<ProductoCantidad> cantidadesProductos, decimal precioTotal)
        {            
            CantidadesProductos = cantidadesProductos;
            PrecioTotal = precioTotal;
        }

    }
}
