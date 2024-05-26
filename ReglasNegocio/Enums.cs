using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ReglasNegocio
{
    public static class Enums
    {
        public enum Estado
        {
            Pendiente = 1,
            EnPreparacion = 2,
            EnCamino = 3,
            Finalizado = 4,
            Cancelado = 5
         
        }
    }
}
