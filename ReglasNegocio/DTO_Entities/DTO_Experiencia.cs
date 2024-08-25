using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ReglasNegocio.DTO_Entities
{
    public class DTO_Experiencia
    {
        public int Id { get; set; }
        public string NombreUsuario { get; set; }
        public DateTime DateTime { get; set; }

        public int Calificacion { get; set; }
        public string Comentario { get; set; }
        public DTO_Experiencia() { }

        public DTO_Experiencia(string nombreUsuario, int calificacion)
        {
            NombreUsuario = nombreUsuario;
            DateTime = DateTime.Now;
            Calificacion = calificacion;
        }
    }
}
