using Microsoft.EntityFrameworkCore;

namespace ProyectoFinal.Models
{
    public class BarContext : DbContext 
    {
        //public DbSet<Usuario> Usuarios { get; set; }

        public BarContext(DbContextOptions<BarContext> options): base(options) { 
            
        }
    }

    
}
