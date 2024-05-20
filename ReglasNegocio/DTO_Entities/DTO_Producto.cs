using ReglasNegocio.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ReglasNegocio.DTO_Entities
{
    public class DTO_Producto
    {
        private int Id { get; set; }
        private string Nombre { get; set; }
        private int IdTipoProducto { get; set; }
        private DTO_TipoProducto TipoProducto { get; set; }

        public DTO_Producto(string nombre, int idTipoProducto, DTO_TipoProducto tipoProducto)
        {
            Nombre = nombre;
            IdTipoProducto = idTipoProducto;
            TipoProducto = tipoProducto;
        }
    }
}
