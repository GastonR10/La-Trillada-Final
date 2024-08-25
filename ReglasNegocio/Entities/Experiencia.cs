using ReglasNegocio.DTO_Entities;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ReglasNegocio.Entities
{
    public class Experiencia
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public string NombreUsuario { get; set; }
        public DateTime Fecha { get; set; }
        [Required]
        [Range(0, 10, ErrorMessage = "El valor debe estar entre 0 y 10.")]
        public int Calificacion { get; set; }
        [StringLength(500, ErrorMessage = "El campo no puede tener más de 500 caracteres.")]
        public string Comentario { get; set; }
        public Experiencia(DTO_Experiencia dto)
        {
            NombreUsuario = dto.NombreUsuario;
            Fecha = DateTime.Now;
            Calificacion = dto.Calificacion;
            Comentario = dto.Comentario;
        }

        public Experiencia(string nombreUsuario, int calificacion, string comentario)
        {
            NombreUsuario = nombreUsuario;
            Fecha = DateTime.Now;
            Calificacion = calificacion;
            Comentario = comentario;
        }
    }
}
