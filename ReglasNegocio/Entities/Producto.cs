using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ReglasNegocio.Entities
{
    public class Producto
    {

        public int Id { get; set; }
        public string Nombre { get; set; }
        public int IdTipoProducto { get; set; }
        public TipoProducto TipoProducto { get; set; }

        public Producto(string nombre, int idTipoProducto, TipoProducto tipoProducto)
        {
            Nombre = nombre;
            IdTipoProducto = idTipoProducto;
            TipoProducto = tipoProducto;
        }
    }
}
