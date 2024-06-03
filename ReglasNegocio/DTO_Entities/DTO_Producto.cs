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
        public int Id { get; set; }
        public string Nombre { get; set; }
        public string Descripcion { get; set; }
        public string Foto { get; set; }
        public int IdTipoProducto { get; set; }
        public DTO_TipoProducto TipoProducto { get; set; }

        public DTO_Producto(string nombre, string descripcion, string foto, int idTipoProducto, DTO_TipoProducto tipoProducto)
        {
            Nombre = nombre;
            Descripcion = descripcion;
            Foto = foto;
            IdTipoProducto = idTipoProducto;
            TipoProducto = tipoProducto;
        }
    }
}
