using ReglasNegocio.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ReglasNegocio.DTO_Entities
{
    public class DTO_ExperienciaFiltrar
    {
        public DateTime? FechaInicio { get; set; }
        public DateTime? FechaFin { get; set; }
        public int? Calificacion { get; set; }

        public DTO_ExperienciaFiltrar() { }

        public DTO_ExperienciaFiltrar(DateTime? fechaInicio, DateTime? fechaFin, int? calificacion)
        {
            FechaInicio = fechaInicio;
            FechaFin = fechaFin;
            Calificacion = calificacion;
        }
    }
}