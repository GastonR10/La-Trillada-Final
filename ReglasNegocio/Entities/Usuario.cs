using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ReglasNegocio.Entities
{
    public class Usuario
    {
        [Key]
        public int Id { get; set; }
        public string NombreUsuario { get; set; }

        public string Password { get; set; }

        public Usuario() { }
        public Usuario(string nombreUsuario, string password)
        {
            NombreUsuario = nombreUsuario;
            Password = password;
        }


    }
}
