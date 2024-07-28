using ReglasNegocio.Entities;

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
        public decimal Precio { get; set; }
        public bool Activo { get; set; }
        public bool Eliminado { get; set; }

        public DTO_Producto()
        {
            Id = 0;
        }
        public DTO_Producto(int id, string nombre, string descripcion, string foto, int idTipoProducto, decimal precio, bool activo, bool eliminado)
        {
            Id = id;
            Nombre = nombre;
            Descripcion = descripcion;
            Foto = foto;
            IdTipoProducto = idTipoProducto;
            Precio = precio;
            Activo = activo;
            Eliminado = eliminado;
        }
        public DTO_Producto(Producto prod)
        {
            Id = prod.Id;
            Nombre = prod.Nombre;            
            Descripcion = prod.Descripcion;                      
            Foto = prod.Foto;
            IdTipoProducto = prod.IdTipoProducto;
            Precio = prod.Precio;
            Activo = prod.Activo;
            Eliminado = prod.Eliminado;
        }
    }
}