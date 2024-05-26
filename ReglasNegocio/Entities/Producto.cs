using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ReglasNegocio.Entities
{
    public class Producto
    {
        [Key]
        public int Id { get; set; }
        public string Nombre { get; set; }
        [ForeignKey(nameof(TipoProducto))]
        public int IdTipoProducto { get; set; }
        public TipoProducto TipoProducto { get; set; }

        public Producto() { }
        public Producto(string nombre, TipoProducto tipoProducto)
        {
            Nombre = nombre;
            TipoProducto = tipoProducto;
        }
    }
}
