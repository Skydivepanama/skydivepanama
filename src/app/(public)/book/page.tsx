import Navbar from '@/components/public/Navbar'
import Footer from '@/components/public/Footer'
import ChatWidget from '@/components/public/ChatWidget'
import BookingForm from '@/components/public/BookingForm'

export default function BookPage() {
  return (
    <>
      <Navbar lang="es" />
      <main className="pt-24 pb-20">
        <div className="max-w-2xl mx-auto px-4">
          <div className="text-center mb-10">
            <div className="text-5xl mb-4">🪂</div>
            <h1 className="text-4xl font-black text-slate-900 mb-2">Reserva Tu Salto</h1>
            <p className="text-slate-500 text-lg">Mínimo $50 USD de depósito para confirmar tu lugar</p>
          </div>
          <BookingForm />
        </div>
      </main>
      <Footer />
      <ChatWidget />
    </>
  )
}
