import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Registro de Participación - CNCU 30 Años',
  description: 'Formulario de registro para la celebración de los 30 años del Curador Urbano en Colombia',
}

export default function RegistroLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
