import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Admin - Registros CNCU',
  description: 'Panel de administración privado para visualizar registros',
  robots: {
    index: false,
    follow: false,
  },
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
