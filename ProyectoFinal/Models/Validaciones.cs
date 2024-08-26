using Microsoft.EntityFrameworkCore;
using ReglasNegocio.Entities;
using System.Text.RegularExpressions;

namespace ProyectoFinal.Models
{   
    public class Validaciones
    {
        public bool EsEmailValido(string email)
        {
            // Expresión regular para validar una dirección de correo electrónico incluyendo TLD de dos letras
            string patron = @"^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$";
            return Regex.IsMatch(email, patron);
        }

        public bool EsContrasenaValida(string contra)
        {
            // Expresión regular para validar que tiene al menos 8 caracteres y al menos un número
            string patron = @"^(?=.*\d).{8,}$";
            return Regex.IsMatch(contra, patron);
        }

        public bool EsNumeroValido(string numero)
        {
            string patron = @"^0\d{8}$";
            return Regex.IsMatch(numero, patron);
        }
    }
    
}
