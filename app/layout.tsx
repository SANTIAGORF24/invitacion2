import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'Invitación 30 Años CNCU - Colegio Nacional de Curadores Urbanos',
  description: 'Celebración de las tres décadas del Colegio Nacional de Curadores Urbanos. 28-29 de Noviembre, 2025 en Montería y San Antero, Córdoba.',
  keywords: ['Curadores Urbanos', 'CNCU', '30 años', 'Montería', 'San Antero', 'Córdoba', 'Evento'],
  authors: [{ name: 'Colegio Nacional de Curadores Urbanos' }],
  openGraph: {
    title: 'Invitación 30 Años CNCU',
    description: 'Celebración de las tres décadas del Colegio Nacional de Curadores Urbanos',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) { 
  return (
    <html lang="es">
      <body className={`font-sans antialiased`}>
        {children}
      </body>
    </html>
  )
}
