using ReglasNegocio.Entities;
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
        public DateTime Fecha { get; set; }
        public int Calificacion { get; set; }
        public string Comentario { get; set; }
        public DTO_Experiencia() { }

        public DTO_Experiencia(string nombreUsuario, int calificacion)
        {
            NombreUsuario = nombreUsuario;
            Calificacion = calificacion;
            Fecha = DateTime.Now;
        }

        public DTO_Experiencia(Experiencia exp)
        {
            NombreUsuario = exp.NombreUsuario;
            Calificacion = exp.Calificacion;
            Fecha = exp.Fecha;
            Comentario = exp.Comentario;
        }
    }
}
