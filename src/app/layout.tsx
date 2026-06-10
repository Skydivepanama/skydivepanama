import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Skydive Panama — Saltos en Tándem',
  description: 'La experiencia más emocionante de Panamá. Reserva tu salto en paracaídas tándem hoy.',
  keywords: 'skydive panama, paracaídas, tandem, salto, aventura',
  openGraph: {
    title: 'Skydive Panama',
    description: 'Salta desde el cielo sobre Panamá',
    url: 'https://skydivepanama.com',
    siteName: 'Skydive Panama',
    images: [{ url: '/og-image.jpg' }],
    locale: 'es_PA',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="min-h-screen flex flex-col antialiased">
        {children}
      </body>
    </html>
  )
}
