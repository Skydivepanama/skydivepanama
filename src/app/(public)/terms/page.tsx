import Navbar from '@/components/public/Navbar'
import Footer from '@/components/public/Footer'

export default function TermsPage() {
  return (
    <>
      <Navbar lang="es" />
      <main className="pt-24 pb-20">
        <div className="max-w-3xl mx-auto px-4">
          <h1 className="text-4xl font-black mb-2" style={{color: '#1a2744'}}>Términos y Condiciones</h1>
          <p className="text-slate-400 text-sm mb-10">Skydive Panama · Última actualización: 2024</p>

          <div className="prose prose-slate max-w-none space-y-6 text-slate-700">

            <section>
              <h2 className="text-xl font-bold mb-3" style={{color: '#1a2744'}}>1. Requisitos de Edad y Peso</h2>
              <p>La edad mínima para participar es de 18 años. El peso máximo permitido es de 200 libras (90 kg). Participantes con peso entre 200 y 210 libras pueden ser aceptados con un cargo adicional de B/.3.00 por libra excedente.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3" style={{color: '#1a2744'}}>2. Procedimientos Pre-Salto</h2>
              <p>Todos los participantes deben completar y firmar los formularios de exención de responsabilidad (waivers) antes del salto. Además, recibirán un briefing de seguridad completo e instrucciones de uso del equipo por parte del instructor asignado.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3" style={{color: '#1a2744'}}>3. Programación de Saltos</h2>
              <p>Los saltos se programan dentro de un horario de 7:00 AM a 5:00 PM, con un aviso mínimo de 48 horas y sujeto a disponibilidad y condiciones climáticas.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3" style={{color: '#1a2744'}}>4. Condiciones Climáticas y Cancelaciones</h2>
              <p>La empresa se reserva el derecho de retrasar o cancelar cualquier salto debido a condiciones climáticas adversas, acciones de la autoridad de aviación civil, fallas mecánicas u eventos imprevistos. En estos casos, se reprogramará el salto para una fecha disponible sin costo adicional.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3" style={{color: '#1a2744'}}>5. Política de Reembolsos y Cancelaciones</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Más de 48 horas de anticipación:</strong> Reprogramación sin cargo.</li>
                <li><strong>Entre 24 y 48 horas:</strong> Se aplica un cargo de reprogramación de $150.</li>
                <li><strong>Menos de 12 horas o no presentarse:</strong> El voucher se considera utilizado, sin reembolso.</li>
                <li><strong>Plazo máximo:</strong> El salto debe realizarse dentro de los 60 días a partir del primer abono.</li>
                <li><strong>Saltos reprogramados:</strong> Se asignarán a disponibilidad entre viernes, sábados y domingos.</li>
              </ul>
              <p className="mt-3">Se aceptan reembolsos en caso de problemas médicos debidamente documentados con certificado médico, o si las operaciones de la zona de salto se ven comprometidas.</p>
              <p className="mt-2">Para solicitar reembolso, envíe un correo a <a href="mailto:info@skydivepanama.net" className="underline" style={{color: '#f4a020'}}>info@skydivepanama.net</a> con el comprobante de pago y sus datos bancarios. El departamento de finanzas procesará la solicitud en 7-12 días hábiles.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3" style={{color: '#1a2744'}}>6. Derechos de Imagen y Medios</h2>
              <p>Al participar, el cliente consiente el uso de fotos y videos tomados durante la actividad para fines promocionales de la empresa. Los servicios de fotografía profesional tienen un costo adicional de $85, y los de video de $65.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3" style={{color: '#1a2744'}}>7. Restricciones de Seguridad</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Está prohibido el uso de dispositivos de grabación personal durante el salto.</li>
                <li>No se permite el consumo de alcohol ni la presencia en las instalaciones bajo efectos de sustancias. El incumplimiento resultará en la pérdida del voucher sin reembolso.</li>
                <li>El participante debe estar en buen estado de salud física y mental.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3" style={{color: '#1a2744'}}>8. Exención de Responsabilidad</h2>
              <p>El paracaidismo es una actividad de aventura con riesgos inherentes. Al reservar y participar, el cliente reconoce y acepta dichos riesgos, exonerando a Skydive Panama, sus empleados e instructores de responsabilidad por accidentes o lesiones que no sean resultado de negligencia grave demostrable.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3" style={{color: '#1a2744'}}>9. Depósito y Pago</h2>
              <p>Se requiere un depósito mínimo de $50 USD para confirmar la reserva. El saldo restante del precio del salto debe liquidarse el día de la actividad. Los métodos de pago aceptados son: tarjeta de crédito/débito, Yappy, ACH y PagoCash.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3" style={{color: '#1a2744'}}>10. Contacto</h2>
              <p>Para consultas sobre estos términos, contáctenos en:</p>
              <ul className="list-none pl-0 mt-2 space-y-1">
                <li>📧 <a href="mailto:info@skydivepanama.net" style={{color: '#f4a020'}}>info@skydivepanama.net</a></li>
                <li>📱 Instagram: <a href="https://instagram.com/skydivepanama" style={{color: '#f4a020'}}>@skydivepanama</a></li>
              </ul>
            </section>

          </div>

          <div className="mt-12 p-6 rounded-2xl border-2" style={{borderColor: '#f4a020', background: '#fffbf0'}}>
            <p className="text-sm text-slate-600">Al realizar una reserva en Skydive Panama, el cliente declara haber leído, comprendido y aceptado todos los términos y condiciones descritos en este documento.</p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
