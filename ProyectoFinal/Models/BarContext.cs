using Microsoft.EntityFrameworkCore;
using ReglasNegocio.Entities;

namespace ProyectoFinal.Models
{
    public class BarContext : DbContext 
    {
        public DbSet<Usuario> Usuarios { get; set; }
        public DbSet<Mesa> Mesa { get; set; }
        public DbSet<Pedido> Pedidos { get; set; }
        public DbSet<Carrito> Carritos { get; set; }
        public DbSet<Producto> Productos { get; set; }
        public DbSet<TipoProducto> TipoProductos { get; set; }
        public DbSet<Experiencia> Experiencias { get; set; }
        public DbSet<ProductoCantidad> ProductoCantidad { get; set; }

        public BarContext(DbContextOptions<BarContext> options): base(options) { 
            
        }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Usuario>()
            .Property(u => u.Nombre)
            .HasDefaultValue(null);

            modelBuilder.Entity<Usuario>()
                .Property(u => u.Apellido)
                .HasDefaultValue(null);

            modelBuilder.Entity<Usuario>()
                .Property(u => u.Email)
                .HasDefaultValue(null);

            modelBuilder.Entity<Usuario>()
                .Property(u => u.Telefono)
                .HasDefaultValue(null);

            modelBuilder.Entity<Usuario>()
                .Property(u => u.Direccion)
                .HasDefaultValue(null);

            // Configurar la herencia de Pedido
            modelBuilder.Entity<Pedido>()
                .HasDiscriminator<string>("TipoPedido")
                .HasValue<PedidoCliente>("Cliente")
                .HasValue<PedidoExpress>("Express");


            modelBuilder.Entity<Usuario>()
           .HasMany(u => u.Pedidos)
           .WithOne(p => p.Cliente)
           .HasForeignKey(p => p.ClienteId)
           .OnDelete(DeleteBehavior.Restrict); // o .OnDelete(DeleteBehavior.NoAction)

            modelBuilder.Entity<PedidoCliente>()
                .HasOne(p => p.Carrito)
                .WithMany()
                .HasForeignKey(p => p.IdCarrito)
                .OnDelete(DeleteBehavior.Cascade); // o .OnDelete(DeleteBehavior.NoAction)

            modelBuilder.Entity<Usuario>()
                .HasOne(u => u.CarritoAbierto)
                .WithMany()
                .HasForeignKey(u => u.CarritoAbiertoId)
                .OnDelete(DeleteBehavior.Restrict);

            //usar datanotations en las clases.
            base.OnModelCreating(modelBuilder);
        }
    }

    
}
