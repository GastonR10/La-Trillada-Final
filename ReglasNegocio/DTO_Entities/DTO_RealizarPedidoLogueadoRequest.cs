using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ReglasNegocio.DTO_Entities
{
    public class DTO_RealizarPedidoLogueadoRequest
    {
        public string Dir { get; set; }
        public int Mesa { get; set; }
        public bool PagoTipo { get; set; }
        public string Comentario { get; set; }

        public DTO_RealizarPedidoLogueadoRequest(string dir, int mesa, bool pagoTipo, string comentario) {
            Dir = dir;
            Mesa = mesa;
            PagoTipo = pagoTipo;
            Comentario = comentario;    
        }
    }
}
