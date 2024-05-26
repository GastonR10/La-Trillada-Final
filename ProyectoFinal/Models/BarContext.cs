using Microsoft.EntityFrameworkCore;
using ReglasNegocio.Entities;

namespace ProyectoFinal.Models
{
    public class BarContext : DbContext 
    {
        public DbSet<Admin> Administradores { get; set; }
        public DbSet<Cliente> Clientes { get; set; }
        public DbSet<Mesa> Mesa { get; set; }
        public DbSet<Pedido> Pedidos { get; set; }
        public DbSet<Carrito> Carritos { get; set; }
        public DbSet<Producto> Productos { get; set; }
        public DbSet<TipoProducto> TipoProductos { get; set; }
        public DbSet<Reserva> Reservas { get; set; }

        public BarContext(DbContextOptions<BarContext> options): base(options) { 
            
        }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Configurar la herencia de Pedido
            modelBuilder.Entity<Pedido>()
                .HasDiscriminator<string>("TipoPedido")
                .HasValue<PedidoCliente>("Cliente")
                .HasValue<PedidoExpress>("Express");

    

            //usar datanotations en las clases.
            base.OnModelCreating(modelBuilder);
        }
    }

    
}
