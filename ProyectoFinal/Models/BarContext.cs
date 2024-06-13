﻿using Microsoft.EntityFrameworkCore;
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
        public DbSet<Reserva> Reservas { get; set; }

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

    

            //usar datanotations en las clases.
            base.OnModelCreating(modelBuilder);
        }
    }

    
}
