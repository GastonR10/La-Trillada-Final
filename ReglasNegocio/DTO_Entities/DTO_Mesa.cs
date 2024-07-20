using ReglasNegocio.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ReglasNegocio.DTO_Entities
{
    public class DTO_Mesa
    {
        public int Id { get; set; }
        public bool Reservada { get; set; }

        public DTO_Mesa(int id, bool reservada) { 
            Id = id;
            Reservada = reservada;
        }

        public DTO_Mesa(Mesa m)
        {
            Id = m.Id;
            Reservada = m.Reservada;
        }
    }
}
