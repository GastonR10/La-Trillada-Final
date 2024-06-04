using ReglasNegocio.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace ReglasNegocio.DTO_Entities
{
    public class DTO_TipoProducto
    {
        public int Id { get; set; }
        public string? Descripcion { get; set; }

        public DTO_TipoProducto()
        {
          
        }

        public DTO_TipoProducto(string descripcion)
        {
            Descripcion = descripcion;
        }

        public DTO_TipoProducto(TipoProducto tipo)
        {
            Id = tipo.Id;
            Descripcion = tipo.Descripcion;
        }
    }
}
