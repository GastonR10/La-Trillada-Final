﻿using ReglasNegocio.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ReglasNegocio.DTO_Entities
{
    public class DTO_Usuario
    {
        public string NombreUsuario { get; set; }
        public string Password { get; set; }
        public string rol { get; set; }
        public string? Nombre { get; set; }
        public string? Apellido { get; set; }
        public string? Email { get; set; }
        public string? Telefono { get; set; }
        public string? Direccion { get; set; }
        public List<DTO_PedidoCliente> Pedidos { get; set; }

        public DTO_Usuario(string nombreUsuario, string password, string rol, string nombre, string apellido, string email, string telefono, string direccion)
        {
            NombreUsuario = nombreUsuario;
            Password = password;
            this.rol = rol;

            if (rol == "cliente")
            {
                Nombre = nombre;
                Apellido = apellido;
                Email = email;
                Telefono = telefono;
                Direccion = direccion;
            }
            else if (rol == "admin")
            {
                Nombre = null;
                Apellido = null;
                Email = null;
                Telefono = null;
                Direccion = null;
            }
        }
    }
}
