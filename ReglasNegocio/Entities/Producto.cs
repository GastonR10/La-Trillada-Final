using ReglasNegocio.DTO_Entities;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ReglasNegocio.Entities
{
    public class Producto
    {
        #region Properties
        [Key]
        public int Id { get; set; }
        public string Nombre { get; set; }
        public string Descripcion { get; set; }
        public string? Foto { get; set; }
        [ForeignKey(nameof(TipoProducto))]
        public int IdTipoProducto { get; set; }
        public TipoProducto TipoProducto { get; set; }
        public bool Activo { get; set; }
        public decimal Precio { get; set; }
        public bool Eliminado { get; set; }
        #endregion

        #region Constructores
        public Producto() { }
        public Producto(string nombre, TipoProducto tipoProducto)
        {
            Nombre = nombre;
            TipoProducto = tipoProducto;
        }
        public Producto(DTO_Producto producto)
        {
            Nombre = producto.Nombre;
            Descripcion = producto.Descripcion;
            Foto = producto.Foto;
            IdTipoProducto = producto.IdTipoProducto;
            Activo = producto.Activo;
            Precio = producto.Precio;
            Eliminado = false;
        }
        #endregion


    }
}