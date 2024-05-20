using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ReglasNegocio.Entities
{
    public class ProductoCantidad
    {
        public int IdProducto { get; set;}
        public Producto Producto { get; set; }
        public int Cantidad { get; set; }

        public ProductoCantidad(int idProducto, Producto producto, int cantidad)
        {
            IdProducto = idProducto;
            Producto = producto;
            Cantidad = cantidad;
        }
    }
}
