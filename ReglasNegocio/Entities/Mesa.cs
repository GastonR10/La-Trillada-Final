using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ReglasNegocio.Entities
{
    public class Mesa
    {

        public int Id { get; set; }
        public bool Reservada { get; set; }

        public Mesa() { }
        public Mesa(int id)
        {
            Id = id;
            Reservada = false;
        }

    }
}
