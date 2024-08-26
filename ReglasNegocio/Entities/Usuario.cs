using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ReglasNegocio.Entities
{
    public class Usuario
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public string NombreUsuario { get; set; }
        [Required]
        public string Password { get; set; }
        [Required]
        public string rol { get; set; }
        public string? Nombre { get; set; }
        public string? Apellido { get; set; }
        public string? Email { get; set; }
        public string? Telefono { get; set; }
        public string? Direccion { get; set; }
        public List<PedidoCliente>? Pedidos { get; set; } = new List<PedidoCliente>();
    
        [ForeignKey(nameof(CarritoAbierto))]
        public int CarritoAbiertoId { get; set; }
        public Carrito? CarritoAbierto { get; set; }

        public Usuario() { }
        public Usuario(string nombreUsuario, string password, string rol, string? nombre, string? apellido, string? email, string? telefono, string? direccion)
        {
            NombreUsuario = nombreUsuario;
            Password = password;
            this.rol = rol;
            Nombre = nombre;
            Apellido = apellido;
            Email = email;
            Telefono = telefono;
            Direccion = direccion;
            CarritoAbierto = new Carrito();

        }
        public Usuario(string nombreUsuario, string password, string rol)
        {
            NombreUsuario = nombreUsuario;
            Password = password;
            this.rol = rol;
            Nombre = null;
            Apellido = null;
            Email = null;
            Telefono = null;
            Direccion = null;
            CarritoAbierto = new Carrito();
        }




    }
}
