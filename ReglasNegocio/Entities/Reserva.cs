using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ReglasNegocio.Entities
{
    public class Reserva
    {
        public int Id { get; set; }
        public DateTime HoraInicio { get; set; }
        public DateTime HoraFin { get; set; }
        public int IdMesa { get; set; }
        public int IdCliente { get; set; }
        public Cliente Cliente { get; set; }

        public Reserva(DateTime horaInicio, DateTime horaFin, int idMesa, int idCliente, Cliente cliente)
        {         
            HoraInicio = horaInicio;
            HoraFin = horaFin;
            IdMesa = idMesa;
            IdCliente = idCliente;
            Cliente = cliente;
        }

    }
}
