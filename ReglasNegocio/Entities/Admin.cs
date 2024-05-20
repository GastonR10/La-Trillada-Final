using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ReglasNegocio.Entities
{
    public class Admin: Usuario
    {
        public Admin(string NombreUsuario, string Password): base(NombreUsuario, Password) 
        { 
            
        }
    }
}
