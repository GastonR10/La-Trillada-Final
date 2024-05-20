using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ReglasNegocio.DTO_Entities
{
    public class DTO_TipoProducto
    {
        private int Id { get; set; }
        private string Descripcion { get; set; }

        public DTO_TipoProducto(string descripcion)
        {
            Descripcion = descripcion;
        }
    }
}
