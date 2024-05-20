using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ReglasNegocio.DTO_Entities
{
    public class DTO_Admin
    {

        private int Id { get; set; }
        private string NombreUsuario { get; set; }
        private string Password { get; set; }
        public DTO_Admin( string nombreUsuario, string password)
        {
            NombreUsuario = nombreUsuario;
            Password = password;
        }
    }
}
