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

        public int Id { get; set; }
        public List<DTO_ProductoCantidad> ProductosCantidad { get; set; }
        public decimal PrecioTotal { get; set; }

        public DTO_Carrito() {
            ProductosCantidad = new List<DTO_ProductoCantidad>();
            PrecioTotal = 0;
        }

        public DTO_Carrito( List<DTO_ProductoCantidad> cantidadesProductos, decimal precioTotal)
        {
            ProductosCantidad = cantidadesProductos;
            PrecioTotal = precioTotal;
        }

        //public DTO_Carrito(Carrito c) { 
            
        //}


    }
}
