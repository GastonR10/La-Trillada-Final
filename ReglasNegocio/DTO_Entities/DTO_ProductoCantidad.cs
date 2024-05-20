using ReglasNegocio.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ReglasNegocio.DTO_Entities
{
    public class DTO_ProductoCantidad
    {
        private int IdProducto { get; set; }
        private DTO_Producto Producto { get; set; }
        private int Cantidad { get; set; }

        public DTO_ProductoCantidad(int idProducto, DTO_Producto producto, int cantidad)
        {
            IdProducto = idProducto;
            Producto = producto;
            Cantidad = cantidad;
        }
    }
}
