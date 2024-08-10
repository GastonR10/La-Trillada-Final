using System;
using Twilio;
using Twilio.Rest.Api.V2010.Account;
using Twilio.Types;

namespace ProyectoFinal.Models
{
    public class WhatsAppService
    {
        private readonly string _accountSid = "AC7419f582de0d165711aaf3b49726717e"; // Tu Account SID de Twilio
        private readonly string _authToken = "599fbaf513375c842d06ab10949e1c26";   // Tu Auth Token de Twilio

        public WhatsAppService()
        {
            TwilioClient.Init(_accountSid, _authToken);
        }

        public async Task EnviarNotificacionWhatsAppAsync(string numeroDestino, string mensaje)
        {
            try
            {
                var to = new PhoneNumber($"whatsapp:{numeroDestino}");
                var from = new PhoneNumber("whatsapp:+14155238886"); // Número de WhatsApp de Twilio

                var message = await MessageResource.CreateAsync(
                    body: mensaje,
                    from: from,
                    to: to
                );

                Console.WriteLine($"Mensaje enviado con SID: {message.Sid}");
            }
            catch (Exception ex)
            {

                throw new Exception(ex.Message);
            }
            
        }
    }
}
