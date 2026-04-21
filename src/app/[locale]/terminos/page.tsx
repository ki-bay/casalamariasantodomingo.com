"use client";
import { useLocale } from "next-intl";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ScrollReveal } from "@/components/ScrollReveal";

export default function TerminosPage() {
  const locale = useLocale();
  const isEN = locale === "en";

  return (
    <main className="relative z-10 min-h-screen flex flex-col">
      <Navbar />
      <div className="pt-28 pb-16 px-6 md:px-12 flex-1">
        <div className="max-w-[760px] mx-auto">
          <ScrollReveal>
            <p className="text-xs font-medium tracking-widest uppercase text-secondary mb-3">
              {isEN ? "Legal" : "Legal"}
            </p>
            <h1 className="font-serif text-3xl md:text-4xl tracking-tight mb-8">
              {isEN ? "Terms & Conditions" : "Términos y Condiciones"}
            </h1>
          </ScrollReveal>

          <div className="prose prose-sm max-w-none text-muted-foreground space-y-8">

            {/* 1. Booking & Payment */}
            <section>
              <h2 className="font-serif text-xl text-foreground mb-3">
                {isEN ? "1. Booking & Payment" : "1. Reservas y Pagos"}
              </h2>
              <p>
                {isEN
                  ? "All bookings at Casa La Maria Zona Colonial are subject to availability and are confirmed only upon full payment. We accept Stripe-processed credit/debit cards. By completing a booking you agree to these Terms & Conditions."
                  : "Todas las reservas en Casa La Maria Zona Colonial están sujetas a disponibilidad y se confirman únicamente al realizar el pago completo. Aceptamos tarjetas de crédito/débito procesadas por Stripe. Al completar una reserva aceptas estos Términos y Condiciones."}
              </p>
            </section>

            {/* 2. Cancellation Policy */}
            <section>
              <h2 className="font-serif text-xl text-foreground mb-3">
                {isEN ? "2. Cancellation Policy — Non-Refundable" : "2. Política de Cancelación — No Reembolsable"}
              </h2>
              <p>
                {isEN
                  ? "Unfortunately, all bookings are strictly non-refundable. Once payment has been processed, no refunds will be issued regardless of the reason for cancellation, including but not limited to: change of plans, illness, travel disruptions, or natural events outside our control."
                  : "Desafortunadamente, todas las reservas son estrictamente no reembolsables. Una vez procesado el pago, no se emitirán reembolsos independientemente del motivo de cancelación, incluyendo pero no limitado a: cambio de planes, enfermedad, interrupciones de viaje o eventos naturales fuera de nuestro control."}
              </p>
              <p className="mt-3">
                {isEN
                  ? "In exceptional circumstances (verified natural disaster, government-mandated travel ban), we may, at our sole discretion, offer a credit toward a future stay. This is not guaranteed and must be requested within 48 hours of the original check-in date."
                  : "En circunstancias excepcionales (desastre natural verificado, prohibición de viaje ordenada por el gobierno), podemos, a nuestra entera discreción, ofrecer un crédito para una estadía futura. Esto no está garantizado y debe solicitarse dentro de las 48 horas posteriores a la fecha de check-in original."}
              </p>
            </section>

            {/* 3. Check-in / Check-out */}
            <section>
              <h2 className="font-serif text-xl text-foreground mb-3">
                {isEN ? "3. Check-in & Check-out" : "3. Check-in y Check-out"}
              </h2>
              <ul className="list-disc list-inside space-y-1">
                <li>{isEN ? "Check-in: from 3:00 PM" : "Check-in: a partir de las 3:00 PM"}</li>
                <li>{isEN ? "Check-out: before 11:00 AM" : "Check-out: antes de las 11:00 AM"}</li>
                <li>{isEN ? "Early check-in and late check-out are subject to availability and must be arranged in advance." : "El early check-in y late check-out están sujetos a disponibilidad y deben coordinarse con anticipación."}</li>
              </ul>
            </section>

            {/* 4. House Rules */}
            <section>
              <h2 className="font-serif text-xl text-foreground mb-3">
                {isEN ? "4. House Rules" : "4. Reglas del Apartamento"}
              </h2>
              <ul className="list-disc list-inside space-y-1">
                <li>{isEN ? "No parties or events of any kind." : "No se permiten fiestas ni eventos de ningún tipo."}</li>
                <li>{isEN ? "Strictly no smoking inside the apartment." : "Prohibido fumar en el interior del apartamento."}</li>
                <li>{isEN ? "No pets allowed." : "No se permiten mascotas."}</li>
                <li>{isEN ? "Quiet hours from 10:00 PM to 8:00 AM." : "Silencio obligatorio de 10:00 PM a 8:00 AM."}</li>
                <li>{isEN ? "Maximum occupancy as stated in the booking must not be exceeded." : "No se puede superar la capacidad máxima indicada en la reserva."}</li>
              </ul>
            </section>

            {/* 5. Security Deposit */}
            <section>
              <h2 className="font-serif text-xl text-foreground mb-3">
                {isEN ? "5. Security Deposit" : "5. Depósito de Seguridad"}
              </h2>
              <p>
                {isEN
                  ? "A refundable security deposit of $100 USD is required at check-in. The deposit will be released within 48 hours after check-out, provided the apartment is returned in the same condition as received, with no damage beyond normal wear and tear."
                  : "Se requiere un depósito de seguridad reembolsable de $100 USD al momento del check-in. El depósito se libera dentro de las 48 horas posteriores al check-out, siempre que el apartamento esté en las mismas condiciones en que fue entregado, sin daños más allá del desgaste normal."}
              </p>
            </section>

            {/* 6. Liability */}
            <section>
              <h2 className="font-serif text-xl text-foreground mb-3">
                {isEN ? "6. Guest Liability" : "6. Responsabilidad del Huésped"}
              </h2>
              <p>
                {isEN
                  ? "Guests are fully responsible for any damage caused to the apartment, its furnishings, or common areas during their stay. The cost of repair or replacement will be charged to the guest's payment method on file."
                  : "Los huéspedes son totalmente responsables de cualquier daño causado al apartamento, su mobiliario o áreas comunes durante su estadía. El costo de reparación o reemplazo será cobrado al método de pago registrado del huésped."}
              </p>
            </section>

            {/* 7. Privacy */}
            <section>
              <h2 className="font-serif text-xl text-foreground mb-3">
                {isEN ? "7. Privacy & Data" : "7. Privacidad y Datos"}
              </h2>
              <p>
                {isEN
                  ? "Personal data collected during the booking process is used solely for the purpose of managing your reservation. We do not store card data — all payments are securely processed by Stripe. We do not sell or share your data with third parties."
                  : "Los datos personales recopilados durante el proceso de reserva se utilizan únicamente para gestionar tu reserva. No almacenamos datos de tarjetas — todos los pagos son procesados de forma segura por Stripe. No vendemos ni compartimos tus datos con terceros."}
              </p>
            </section>

            {/* 8. Governing Law */}
            <section>
              <h2 className="font-serif text-xl text-foreground mb-3">
                {isEN ? "8. Governing Law" : "8. Legislación Aplicable"}
              </h2>
              <p>
                {isEN
                  ? "These Terms & Conditions are governed by the laws of the Dominican Republic. Any disputes shall be subject to the exclusive jurisdiction of the courts of Santo Domingo, Dominican Republic."
                  : "Estos Términos y Condiciones se rigen por las leyes de la República Dominicana. Cualquier disputa estará sujeta a la jurisdicción exclusiva de los tribunales de Santo Domingo, República Dominicana."}
              </p>
            </section>

            {/* Contact */}
            <section className="border-t border-border pt-6">
              <p className="text-sm">
                {isEN ? "Questions about these Terms?" : "¿Preguntas sobre estos Términos?"}{" "}
                <a href="mailto:info@casalamariazonacolonial.com" className="text-accent hover:underline">
                  info@casalamariazonacolonial.com
                </a>
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                {isEN ? "Last updated: April 2026" : "Última actualización: Abril 2026"}
              </p>
            </section>

            {/* Privacy Policy */}
            <section id="privacidad" className="border-t border-border pt-8 mt-8">
              <h2 className="font-serif text-2xl text-foreground mb-6">
                {isEN ? "Privacy Policy" : "Política de Privacidad"}
              </h2>
              <section>
                <h3 className="font-serif text-lg text-foreground mb-2">{isEN ? "1. Data We Collect" : "1. Datos que Recopilamos"}</h3>
                <p>{isEN ? "We collect the information you provide when making a booking or contacting us: name, email address, phone number, booking dates, and payment details (processed securely by Stripe)." : "Recopilamos la información que nos proporcionas al hacer una reserva o contactarnos: nombre, correo electrónico, teléfono, fechas de reserva y datos de pago (procesados de forma segura por Stripe)."}</p>
              </section>
              <section className="mt-4">
                <h3 className="font-serif text-lg text-foreground mb-2">{isEN ? "2. How We Use Your Data" : "2. Cómo Usamos tus Datos"}</h3>
                <p>{isEN ? "Your data is used exclusively to process and manage your booking, respond to inquiries, and improve our services. We do not sell or share your personal data with third parties, except where required to complete your booking (Stripe, communication providers)." : "Tus datos se utilizan exclusivamente para procesar y gestionar tu reserva, responder consultas y mejorar nuestros servicios. No vendemos ni compartimos tus datos personales con terceros, salvo lo necesario para completar tu reserva (Stripe, proveedores de comunicación)."}</p>
              </section>
              <section className="mt-4">
                <h3 className="font-serif text-lg text-foreground mb-2">{isEN ? "3. Data Retention" : "3. Retención de Datos"}</h3>
                <p>{isEN ? "We retain booking and contact data for up to 3 years for legal and accounting purposes. You may request deletion of your data at any time by contacting us." : "Conservamos los datos de reservas y contacto hasta 3 años por razones legales y contables. Puedes solicitar la eliminación de tus datos en cualquier momento contactándonos."}</p>
              </section>
              <section className="mt-4">
                <h3 className="font-serif text-lg text-foreground mb-2">{isEN ? "4. Your Rights" : "4. Tus Derechos"}</h3>
                <p>{isEN ? "You have the right to access, correct, or delete your personal data. To exercise these rights, contact us at info@casalamariazonacolonial.com." : "Tienes derecho a acceder, corregir o eliminar tus datos personales. Para ejercer estos derechos, contáctanos en info@casalamariazonacolonial.com."}</p>
              </section>
            </section>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
