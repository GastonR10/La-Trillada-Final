using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ReglasNegocio.Entities
{
    public class Reserva
    {
        [Key]
        public int Id { get; set; }
        public DateTime HoraInicio { get; set; }
        public DateTime HoraFin { get; set; }
        [ForeignKey(nameof(Mesa))]
        public int IdMesa { get; set; }
        [ForeignKey(nameof(Usuario))]
        public int IdCliente { get; set; }
        public Usuario Cliente { get; set; }
        public Reserva() { }    
        public Reserva(DateTime horaInicio, DateTime horaFin, int idMesa, Usuario cliente)
        {         
            HoraInicio = horaInicio;
            HoraFin = horaFin;
            IdMesa = idMesa;
            Cliente = cliente;
        }

    }
}
