using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ReglasNegocio.DTO_Entities
{
    public class DTO_Mesa
    {
        private int Id { get; set; }
        private bool Reservada { get; set; }

        public DTO_Mesa(int id, bool reservada) { 
            Id = id;
            Reservada = reservada;
        }   
    }
}
