using ReglasNegocio.Entities;

namespace ReglasNegocio.DTO_Entities
{
    public class DTO_TipoProducto
    {
        public int Id { get; set; }
        public string? Descripcion { get; set; }
        public int Orden { get; set; }

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
            Orden = tipo.Orden;
        }
    }
}
