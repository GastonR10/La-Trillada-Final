using System.ComponentModel.DataAnnotations;

namespace ReglasNegocio.Entities
{
    public class TipoProducto
    {
        [Key]
        public int Id { get; set; }
        public string Descripcion { get; set; }
        public int Orden { get; set; }

        public TipoProducto() { }
        public TipoProducto(string descripcion)
        {
            Descripcion = descripcion;
        }
    }
}
