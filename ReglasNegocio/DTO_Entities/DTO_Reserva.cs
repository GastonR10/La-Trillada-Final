using ReglasNegocio.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ReglasNegocio.DTO_Entities
{
    public class DTO_Reserva
    {
        private int Id { get; set; }
        private DateTime HoraInicio { get; set; }
        private DateTime HoraFin { get; set; }
        private int IdMesa { get; set; }
        private int IdCliente { get; set; }
        private DTO_Cliente Cliente { get; set; }

        public DTO_Reserva(int id, DateTime horaInicio, DateTime horaFin, int idMesa, int idCliente, DTO_Cliente cliente)
        {
            Id = id;
            HoraInicio = horaInicio;
            HoraFin = horaFin;
            IdMesa = idMesa;
            IdCliente = idCliente;
            Cliente = cliente;
        }
    }
}
