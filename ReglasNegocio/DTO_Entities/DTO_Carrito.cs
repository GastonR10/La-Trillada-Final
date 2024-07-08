using ReglasNegocio.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ReglasNegocio.DTO_Entities
{
    public class DTO_Carrito
    {     

        private int Id { get; set; }
        private List<DTO_ProductoCantidad> CantidadesProductos { get; set; }
        private decimal PrecioTotal { get; set; }

        public DTO_Carrito() { 
            CantidadesProductos = new List<DTO_ProductoCantidad>();
            PrecioTotal = 0;
        }

        public DTO_Carrito( List<DTO_ProductoCantidad> cantidadesProductos, decimal precioTotal)
        {
            CantidadesProductos = cantidadesProductos;
            PrecioTotal = precioTotal;
        }


    }
}
