"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Download, RefreshCw, Calendar, MapPin, User, Hash } from "lucide-react"
import * as XLSX from 'xlsx'

interface Asistencia {
  id: string
  nombre: string
  numero_despacho: string
  municipio: string
  fecha_registro: string
  created_at: string
}

export default function AdminRegistros() {
  const [registros, setRegistros] = useState<Asistencia[]>([])
  const [loading, setLoading] = useState(true)
  const [exportando, setExportando] = useState(false)

  const cargarRegistros = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('asistencias')
        .select('*')
        .order('fecha_registro', { ascending: false })

      if (error) {
        console.error('Error al cargar registros:', error)
        alert('Error al cargar los registros')
        return
      }

      setRegistros(data || [])
    } catch (err) {
      console.error('Error inesperado:', err)
      alert('Error al cargar los registros')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    cargarRegistros()
  }, [])

  const exportarAExcel = () => {
    setExportando(true)
    try {
      // Preparar datos para Excel
      const datosExcel = registros.map((registro, index) => ({
        '#': index + 1,
        'Nombre Completo': registro.nombre,
        'Número de Despacho': registro.numero_despacho,
        'Municipio/Ciudad': registro.municipio,
        'Fecha de Registro': new Date(registro.fecha_registro).toLocaleString('es-CO', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          timeZone: 'America/Bogota'
        })
      }))

      // Crear libro de trabajo
      const ws = XLSX.utils.json_to_sheet(datosExcel)
      const wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, ws, "Asistencias")

      // Ajustar ancho de columnas
      const maxWidth = [
        { wch: 5 },  // #
        { wch: 40 }, // Nombre
        { wch: 20 }, // Número Despacho
        { wch: 30 }, // Municipio
        { wch: 25 }, // Fecha
      ]
      ws['!cols'] = maxWidth

      // Descargar archivo
      const fecha = new Date().toISOString().split('T')[0]
      XLSX.writeFile(wb, `Asistencias_CNCU_30_Años_${fecha}.xlsx`)
    } catch (err) {
      console.error('Error al exportar:', err)
      alert('Error al exportar a Excel')
    } finally {
      setExportando(false)
    }
  }

  const formatearFecha = (fecha: string) => {
    return new Date(fecha).toLocaleString('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'America/Bogota'
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 p-4 sm:p-6 md:p-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 rounded-2xl border-2 border-primary/20 bg-white p-6 shadow-xl">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="mb-2 text-3xl font-bold text-primary md:text-4xl">
                📋 Registros de Asistencia
              </h1>
              <p className="text-muted-foreground">
                Evento 30 Años CNCU - Montería y San Antero 2025
              </p>
              <p className="mt-1 text-sm font-semibold text-secondary">
                Total de registros: {registros.length}
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                onClick={cargarRegistros}
                disabled={loading}
                variant="outline"
                className="h-12"
              >
                <RefreshCw className={`mr-2 h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
                Actualizar
              </Button>
              <Button
                onClick={exportarAExcel}
                disabled={exportando || registros.length === 0}
                className="h-12 bg-green-600 hover:bg-green-700"
              >
                <Download className="mr-2 h-5 w-5" />
                {exportando ? 'Exportando...' : 'Exportar a Excel'}
              </Button>
            </div>
          </div>
        </div>

        {/* Tabla de registros */}
        <div className="rounded-2xl border-2 border-primary/20 bg-white shadow-xl">
          {loading ? (
            <div className="flex min-h-[400px] items-center justify-center">
              <div className="text-center">
                <RefreshCw className="mx-auto mb-4 h-12 w-12 animate-spin text-primary" />
                <p className="text-lg text-muted-foreground">Cargando registros...</p>
              </div>
            </div>
          ) : registros.length === 0 ? (
            <div className="flex min-h-[400px] items-center justify-center">
              <div className="text-center">
                <p className="text-xl text-muted-foreground">No hay registros todavía</p>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b-2 border-primary/20 bg-primary/5">
                  <tr>
                    <th className="p-4 text-left text-sm font-bold text-primary">#</th>
                    <th className="p-4 text-left text-sm font-bold text-primary">
                      <User className="mb-1 inline h-4 w-4" /> Nombre
                    </th>
                    <th className="p-4 text-left text-sm font-bold text-primary">
                      <Hash className="mb-1 inline h-4 w-4" /> N° Despacho
                    </th>
                    <th className="p-4 text-left text-sm font-bold text-primary">
                      <MapPin className="mb-1 inline h-4 w-4" /> Municipio
                    </th>
                    <th className="p-4 text-left text-sm font-bold text-primary">
                      <Calendar className="mb-1 inline h-4 w-4" /> Fecha de Registro
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {registros.map((registro, index) => (
                    <tr
                      key={registro.id}
                      className={`border-b border-gray-200 transition-colors hover:bg-secondary/5 ${
                        index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                      }`}
                    >
                      <td className="p-4 text-sm font-semibold text-muted-foreground">
                        {index + 1}
                      </td>
                      <td className="p-4">
                        <span className="font-semibold text-foreground">{registro.nombre}</span>
                      </td>
                      <td className="p-4">
                        <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primary">
                          {registro.numero_despacho}
                        </span>
                      </td>
                      <td className="p-4 text-sm text-foreground">{registro.municipio}</td>
                      <td className="p-4 text-sm text-muted-foreground">
                        {formatearFecha(registro.fecha_registro)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer con información */}
        <div className="mt-6 rounded-xl border border-primary/10 bg-white/50 p-4 text-center">
          <p className="text-sm text-muted-foreground">
            🔒 Esta página es privada. Solo accesible mediante URL directa.
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Los registros se actualizan automáticamente desde Supabase
          </p>
        </div>
      </div>
    </div>
  )
}
