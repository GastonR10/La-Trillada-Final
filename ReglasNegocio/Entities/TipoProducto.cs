using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ReglasNegocio.Entities
{
    public class TipoProducto
    {
        [Key]
        public int Id { get; set; }
        public string Descripcion { get; set; }

        public TipoProducto() { }
        public TipoProducto(string descripcion)
        {            
            Descripcion = descripcion;
        }
    }
}
