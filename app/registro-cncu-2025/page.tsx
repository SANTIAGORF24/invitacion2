"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calendar, MapPin, User, Hash, CheckCircle2, Sparkles } from "lucide-react"
import { useRouter } from "next/navigation"

export default function RegistroPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [enviado, setEnviado] = useState(false)
  const [formData, setFormData] = useState({
    nombre: "",
    numero_despacho: "",
    municipio: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validación
    if (!formData.nombre || !formData.numero_despacho || !formData.municipio) {
      alert("Por favor complete todos los campos")
      return
    }

    setLoading(true)

    try {
      const { error } = await supabase.from("asistencias").insert([
        {
          nombre: formData.nombre,
          numero_despacho: formData.numero_despacho,
          municipio: formData.municipio,
          fecha_registro: new Date().toISOString(),
        },
      ])

      if (error) {
        console.error("Error al registrar:", error)
        alert("Error al registrar su asistencia. Por favor intente nuevamente.")
        return
      }

      setEnviado(true)
      
      // Redirigir a la página principal después de 3 segundos
      setTimeout(() => {
        router.push("/")
      }, 3000)
    } catch (err) {
      console.error("Error inesperado:", err)
      alert("Error al registrar su asistencia. Por favor intente nuevamente.")
    } finally {
      setLoading(false)
    }
  }

  if (enviado) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/5 p-4">
        <div className="w-full max-w-md text-center">
          <div className="rounded-3xl border-2 border-green-500/20 bg-white p-8 shadow-2xl">
            <div className="mb-6 flex justify-center">
              <div className="rounded-full bg-gradient-to-br from-green-500 to-green-600 p-6 shadow-2xl">
                <CheckCircle2 className="h-16 w-16 text-white" />
              </div>
            </div>
            <h2 className="mb-4 text-3xl font-bold text-green-600">
              ¡Registro Exitoso!
            </h2>
            <p className="mb-6 text-lg text-foreground">
              Su participación ha sido confirmada exitosamente.
            </p>
            <p className="text-sm text-muted-foreground">
              Nos vemos el 28 y 29 de noviembre en Montería y San Antero.
            </p>
            <div className="mt-6 rounded-xl bg-green-50 p-4">
              <p className="text-xs italic text-green-700">
                Redirigiendo a la página principal...
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 p-4 sm:p-6 md:p-8">
      <div className="mx-auto max-w-2xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mb-6 flex justify-center">
            <div className="rounded-full bg-gradient-to-br from-primary to-secondary p-6 shadow-2xl">
              <Sparkles className="h-12 w-12 text-white md:h-16 md:w-16" />
            </div>
          </div>
          <h1 className="mb-4 font-serif text-3xl font-bold text-primary md:text-4xl lg:text-5xl">
            Registro de Participación
          </h1>
          <p className="text-lg text-muted-foreground md:text-xl">
            Celebración 30 Años del Curador Urbano en Colombia
          </p>
          <div className="mx-auto mt-4 flex max-w-xl flex-col gap-2 text-sm text-foreground sm:flex-row sm:justify-center sm:gap-4">
            <span className="flex items-center justify-center gap-2">
              <Calendar className="h-4 w-4 text-primary" />
              28-29 Noviembre 2025
            </span>
            <span className="flex items-center justify-center gap-2">
              <MapPin className="h-4 w-4 text-secondary" />
              Montería y San Antero
            </span>
          </div>
        </div>

        {/* Formulario */}
        <div className="rounded-3xl border-2 border-primary/20 bg-white p-6 shadow-2xl md:p-8 lg:p-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Nombre Completo */}
            <div className="space-y-2">
              <Label htmlFor="nombre" className="flex items-center gap-2 text-base font-semibold text-foreground">
                <User className="h-5 w-5 text-primary" />
                Nombre Completo *
              </Label>
              <Input
                id="nombre"
                name="nombre"
                type="text"
                placeholder="Ej: Juan Carlos Pérez García"
                value={formData.nombre}
                onChange={handleChange}
                required
                disabled={loading}
                className="h-12 text-base"
              />
            </div>

            {/* Número de Despacho */}
            <div className="space-y-2">
              <Label htmlFor="numero_despacho" className="flex items-center gap-2 text-base font-semibold text-foreground">
                <Hash className="h-5 w-5 text-primary" />
                Número de Despacho *
              </Label>
              <Input
                id="numero_despacho"
                name="numero_despacho"
                type="text"
                placeholder="Ej: 001-2024"
                value={formData.numero_despacho}
                onChange={handleChange}
                required
                disabled={loading}
                className="h-12 text-base"
              />
            </div>

            {/* Municipio/Ciudad */}
            <div className="space-y-2">
              <Label htmlFor="municipio" className="flex items-center gap-2 text-base font-semibold text-foreground">
                <MapPin className="h-5 w-5 text-primary" />
                Municipio/Ciudad *
              </Label>
              <Input
                id="municipio"
                name="municipio"
                type="text"
                placeholder="Ej: Bogotá D.C."
                value={formData.municipio}
                onChange={handleChange}
                required
                disabled={loading}
                className="h-12 text-base"
              />
            </div>

            {/* Nota importante */}
            <div className="rounded-xl bg-secondary/10 p-4">
              <p className="text-sm font-semibold text-secondary">
                ⭐ Beneficio Especial
              </p>
              <p className="mt-2 text-xs text-muted-foreground">
                Los primeros 30 asociados que confirmen su asistencia recibirán una noche de alojamiento gratuita correspondiente al viernes 28 de noviembre de 2025.
              </p>
            </div>

            {/* Botón de envío */}
            <Button
              type="submit"
              disabled={loading}
              className="h-14 w-full bg-gradient-to-r from-primary to-secondary text-lg font-bold text-white shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-primary/50"
            >
              {loading ? "Registrando..." : "Confirmar Participación"}
            </Button>
          </form>

          {/* Footer del formulario */}
          <div className="mt-6 text-center">
            <p className="text-xs text-muted-foreground">
              * Todos los campos son obligatorios
            </p>
          </div>
        </div>

        {/* Información adicional */}
        <div className="mt-6 rounded-xl border border-primary/10 bg-white/50 p-4 text-center">
          <p className="text-sm text-muted-foreground">
            Para más información sobre el evento, consulte la invitación oficial.
          </p>
        </div>
      </div>
    </div>
  )
}
