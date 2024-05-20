using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ReglasNegocio.Entities
{
    public class TipoProducto
    {
        public int Id { get; set; }
        public string Descripcion { get; set; }

        public TipoProducto(string descripcion)
        {            
            Descripcion = descripcion;
        }
    }
}
