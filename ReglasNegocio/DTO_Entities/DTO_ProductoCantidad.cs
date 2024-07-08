using ReglasNegocio.Entities;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ReglasNegocio.DTO_Entities
{
    public class DTO_ProductoCantidad
    {
        public int Id { get; set; }               
        public int IdProducto { get; set; }
        public DTO_Producto? Producto { get; set; }
        public int Cantidad { get; set; }    
        public int IdCarrito { get; set; }

        public Carrito? Carrito { get; set; }

        public DTO_ProductoCantidad() { 
            Id = 0;
            Producto = null;
            Cantidad = 0;
            IdCarrito = 0;
        }
        public DTO_ProductoCantidad(ProductoCantidad pc)
        {
            Id = pc.Id;
            Producto = new DTO_Producto(pc.Producto); 
            Cantidad = pc.Cantidad;
            IdCarrito = pc.IdCarrito;   
        }
    }
}
