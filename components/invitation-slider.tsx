"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { ChevronRight, ChevronLeft, MapPin, Clock, Calendar, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Image from "next/image"
import { supabase } from "@/lib/supabase"

export default function InvitationSlider() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [direction, setDirection] = useState<"next" | "prev">("next")
  const [isAnimating, setIsAnimating] = useState(false)
  const [formData, setFormData] = useState({ nombre: "", numeroCurador: "", municipio: "" })
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [showElements, setShowElements] = useState({
    logo: false,
    title: false,
    subtitle: false,
    logo30: false,
    dates: false,
    location: false,
    button: false,
    sideImage: false,
  })

  const nextSlide = () => {
    if (isAnimating) return
    setDirection("next")
    setIsAnimating(true)
    setCurrentSlide((prev) => (prev + 1) % 3)
  }

  const prevSlide = () => {
    if (isAnimating) return
    setDirection("prev")
    setIsAnimating(true)
    setCurrentSlide((prev) => (prev - 1 + 3) % 3)
  }

  const goToRegistration = () => {
    if (isAnimating) return
    setDirection("next")
    setIsAnimating(true)
    setCurrentSlide(2)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      // Guardar en Supabase
      const { data, error } = await supabase
        .from('asistencias')
        .insert([
          {
            nombre: formData.nombre,
            numero_despacho: formData.numeroCurador,
            municipio: formData.municipio,
          }
        ])
        .select()

      if (error) {
        console.error('Error al guardar:', error)
        alert('Hubo un error al registrar tu asistencia. Por favor intenta nuevamente.')
        return
      }

      console.log("Registro guardado exitosamente:", data)
      setIsSubmitted(true)
      
      // Resetear formulario después de 3 segundos
      setTimeout(() => {
        setIsSubmitted(false)
        setFormData({ nombre: "", numeroCurador: "", municipio: "" })
      }, 3000)
    } catch (err) {
      console.error('Error inesperado:', err)
      alert('Hubo un error al registrar tu asistencia. Por favor intenta nuevamente.')
    }
  }

  useEffect(() => {
    if (isAnimating) {
      const timer = setTimeout(() => setIsAnimating(false), 800)
      return () => clearTimeout(timer)
    }
  }, [isAnimating])

  // Animaciones secuenciales para el primer slide
  useEffect(() => {
    if (currentSlide === 0) {
      // Reset todos los elementos
      setShowElements({
        logo: false,
        title: false,
        subtitle: false,
        logo30: false,
        dates: false,
        location: false,
        button: false,
        sideImage: false,
      })

      // Animación secuencial con timers
      const timers = [
        setTimeout(() => setShowElements(prev => ({ ...prev, logo: true })), 100),
        setTimeout(() => setShowElements(prev => ({ ...prev, title: true })), 400),
        setTimeout(() => setShowElements(prev => ({ ...prev, subtitle: true })), 900),
        setTimeout(() => setShowElements(prev => ({ ...prev, logo30: true })), 1400),
        setTimeout(() => setShowElements(prev => ({ ...prev, dates: true })), 1900),
        setTimeout(() => setShowElements(prev => ({ ...prev, location: true })), 2200),
        setTimeout(() => setShowElements(prev => ({ ...prev, button: true })), 2500),
        setTimeout(() => setShowElements(prev => ({ ...prev, sideImage: true })), 1500),
      ]

      return () => timers.forEach(timer => clearTimeout(timer))
    }
  }, [currentSlide])

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-white dark:bg-white">
      {currentSlide === 0 && (
        <div 
          className={`absolute left-1/2 top-4 z-30 -translate-x-1/2 md:top-8 lg:left-auto lg:right-8 lg:translate-x-0 transition-all duration-1000 ${
            showElements.logo ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-8"
          }`}
        >
          <Image
            src="/images/cncu-logo.webp"
            alt="Colegio Nacional de Curadores Urbanos"
            width={180}
            height={80}
            className="h-auto w-32 drop-shadow-lg sm:w-36 md:w-40 lg:w-44"
          />
        </div>
      )}

      {/* Slide 1 - Invitación Principal */}
      <div
        className={`absolute inset-0 flex items-center justify-center transition-all duration-700 ease-in-out ${
          currentSlide === 0
            ? "translate-x-0 opacity-100"
            : direction === "next"
              ? "-translate-x-full opacity-0"
              : "translate-x-full opacity-0"
        }`}
      >
        <div className="relative h-full w-full bg-white dark:bg-white">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-primary/5 to-transparent md:block" />
            <div className="absolute bottom-0 left-0 h-1/3 w-full bg-gradient-to-t from-secondary/5 to-transparent md:block" />
            <div className="absolute right-[10%] top-[15%] h-64 w-64 animate-pulse rounded-full border-2 border-primary/20 opacity-40" />
            <div
              className="absolute right-[12%] top-[17%] h-56 w-56 animate-pulse rounded-full border border-primary/10 opacity-30"
              style={{ animationDelay: "1s" }}
            />
            <div
              className="absolute bottom-[20%] right-[15%] h-32 w-32 animate-pulse rounded-full border-2 border-secondary/20 opacity-40"
              style={{ animationDelay: "0.5s" }}
            />
            <div
              className="absolute bottom-[22%] right-[17%] h-24 w-24 animate-pulse rounded-full border border-secondary/10 opacity-30"
              style={{ animationDelay: "1.5s" }}
            />
            <div className="absolute left-[5%] top-[30%] h-40 w-40 rounded-full bg-gradient-to-br from-primary/5 to-transparent blur-2xl" />
            <div className="absolute bottom-[10%] left-[10%] h-48 w-48 rounded-full bg-gradient-to-tr from-secondary/5 to-transparent blur-3xl" />
            <div className="absolute right-[5%] bottom-[40%] h-36 w-36 rounded-full bg-gradient-to-bl from-primary/5 to-transparent blur-2xl" />
          </div>

          <div className="relative z-10 flex h-full items-center justify-center overflow-y-auto px-4 py-20 sm:px-6 md:px-12 md:py-8 lg:px-24">
            <div className="w-full max-w-7xl">
              <div className="space-y-6 text-center md:space-y-8 lg:text-left">
                {/* Título principal */}
                <div
                  className={`space-y-3 transition-all duration-1000 md:space-y-4 ${
                    showElements.title ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0"
                  }`}
                >
                  <h1 className="text-balance font-serif text-2xl font-bold leading-tight tracking-tight text-primary sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl">
                    EL COLEGIO NACIONAL DE CURADORES URBANOS
                  </h1>
                </div>

                {/* Logo 30 años (móvil) */}
                <div
                  className={`transition-all duration-1000 lg:hidden ${
                    showElements.logo30 ? "scale-100 opacity-100 translate-y-0" : "scale-75 opacity-0 translate-y-12"
                  }`}
                >
                  <div className="flex flex-col items-center gap-3">
                    <Image
                      src="/images/30-anos-logo.png"
                      alt="30 Años Curador Urbano"
                      width={200}
                      height={200}
                      className="h-32 w-auto drop-shadow-2xl sm:h-40"
                    />
                    <div 
                      className={`flex items-start justify-center gap-2 md:gap-3 lg:justify-start transition-all duration-700 delay-200 ${
                        showElements.subtitle ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"
                      }`}
                    >
                      <p
                        className="text-balance text-xl leading-relaxed text-secondary italic antialiased sm:text-2xl md:text-3xl lg:text-4xl"
                        style={{
                          fontFamily:
                            '"Playfair Display","Cormorant Garamond","EB Garamond","Libre Baskerville","Times New Roman",serif',
                          letterSpacing: "-0.01em",
                          fontWeight: 500,
                          fontFeatureSettings: '"liga","clig","kern"',
                        }}
                      >
                        Tiene el honor de invitarle a celebrar
                      </p>
                    </div>
                    <div 
                      className={`text-center transition-all duration-700 delay-400 ${
                        showElements.subtitle ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                      }`}
                    >
                      <p className="text-balance font-serif text-lg font-bold text-primary sm:text-xl">
                        TRES DECADAS DE SERVICIO
                      </p>
                      <div className="mx-auto mt-1 h-1 w-16 rounded-full bg-gradient-to-r from-primary to-secondary sm:w-20" />
                    </div>
                  </div>
                </div>

                {/* Fechas */}
                <div
                  className={`space-y-2 transition-all duration-1000 md:space-y-3 ${
                    showElements.dates ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0"
                  }`}
                >
                  <div className="mx-auto flex max-w-md items-center gap-2 rounded-lg bg-card p-3 shadow-sm md:gap-3 md:p-4 lg:mx-0">
                    <Calendar className="h-4 w-4 text-primary md:h-5 md:w-5" />
                    <p className="text-sm font-semibold text-foreground md:text-base">28 - 29 de Noviembre, 2025</p>
                  </div>
                </div>

                {/* Ubicación */}
                <div
                  className={`transition-all duration-1000 ${
                    showElements.location ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
                  }`}
                >
                  <div className="mx-auto flex max-w-md items-center gap-2 rounded-lg bg-card p-3 shadow-sm md:gap-3 md:p-4 lg:mx-0">
                    <MapPin className="h-4 w-4 text-secondary md:h-5 md:w-5" />
                    <p className="text-sm font-semibold text-foreground md:text-base">Montería y San Antero, Córdoba</p>
                  </div>
                </div>

                {/* Botón de registro */}
                <div
                  className={`transition-all duration-1000 ${
                    showElements.button ? "scale-100 opacity-100 translate-y-0" : "scale-90 opacity-0 translate-y-8"
                  }`}
                >
                  <div className="flex justify-center lg:justify-start">
                    <Button
                      onClick={goToRegistration}
                      size="lg"
                      className="group h-12 rounded-full bg-primary px-6 text-base font-semibold shadow-lg transition-all hover:scale-105 hover:shadow-xl md:h-14 md:px-8 md:text-lg"
                    >
                      Confirme su Asistencia Aquí
                      <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1 md:h-5 md:w-5" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Logo 30 años lateral (desktop) */}
              <div className="absolute right-12 top-1/2 hidden -translate-y-1/2 lg:block xl:right-24">
                <div
                  className={`relative transition-all duration-1000 ${
                    showElements.sideImage ? "translate-x-0 scale-100 opacity-100" : "translate-x-24 scale-75 opacity-0"
                  }`}
                >
                  <div className="absolute inset-0 -z-10 flex items-center justify-center">
                    <div className="h-[350px] w-[350px] rounded-full bg-gradient-to-br from-primary/10 to-secondary/10 xl:h-[400px] xl:w-[400px] animate-pulse" />
                  </div>

                  <div className="relative flex flex-col items-center gap-6 p-8">
                    <Image
                      src="/images/30-anos-logo.png"
                      alt="30 Años Curador Urbano"
                      width={300}
                      height={300}
                      className="h-64 w-auto drop-shadow-2xl xl:h-80"
                    />

                    <div 
                      className={`text-center transition-all duration-700 delay-500 ${
                        showElements.sideImage ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                      }`}
                    >
                      <p className="text-balance font-serif text-3xl font-bold text-primary">3 Décadas de Servicio</p>
                      <div className="mx-auto mt-2 h-1 w-24 rounded-full bg-gradient-to-r from-primary to-secondary" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Slide 2 - Programa del Evento */}
      <div
        className={`absolute inset-0 flex items-center justify-center transition-all duration-700 ease-in-out ${
          currentSlide === 1
            ? "translate-x-0 opacity-100"
            : direction === "next"
              ? "-translate-x-full opacity-0"
              : "translate-x-full opacity-0"
        }`}
      >
        <div className="relative h-full w-full bg-white dark:bg-white">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute left-0 top-0 h-full w-1/2 bg-gradient-to-r from-secondary/10 via-secondary/5 to-transparent" />
            <div className="absolute bottom-0 right-0 h-1/2 w-full bg-gradient-to-t from-primary/10 via-primary/5 to-transparent" />
            <div className="absolute left-[8%] top-[25%] h-48 w-48 animate-pulse rounded-full border border-secondary/15 opacity-30" />
            <div
              className="absolute right-[8%] bottom-[30%] h-40 w-40 animate-pulse rounded-full border border-primary/15 opacity-30"
              style={{ animationDelay: "0.7s" }}
            />
            <div className="absolute left-[15%] bottom-[15%] h-32 w-32 rounded-full bg-gradient-to-br from-secondary/5 to-transparent blur-2xl" />
            <div className="absolute right-[20%] top-[20%] h-36 w-36 rounded-full bg-gradient-to-tl from-primary/5 to-transparent blur-2xl" />
          </div>

          <div className="relative z-10 flex h-full items-center justify-center overflow-y-auto px-4 py-12 sm:px-6 md:px-12 md:py-16 lg:px-24">
            <div className="w-full max-w-6xl space-y-6 md:space-y-8">
              <div
                className={`text-center transition-all duration-1000 delay-200 ${
                  currentSlide === 1 && !isAnimating ? "translate-y-0 opacity-100" : "-translate-y-8 opacity-0"
                }`}
              >
                <h2 className="mb-2 font-serif text-2xl font-bold text-primary sm:text-3xl md:text-4xl lg:text-5xl">
                  Programa del Evento
                </h2>
                <p className="text-base text-muted-foreground md:text-lg">Dos días de celebración y actividades</p>
              </div>

              <div className="grid grid-cols-1 gap-6 md:gap-8 lg:grid-cols-2">
                {/* Viernes 28 */}
                <div
                  className={`transition-all duration-1000 delay-300 ${
                    currentSlide === 1 && !isAnimating ? "translate-x-0 opacity-100" : "-translate-x-12 opacity-0"
                  }`}
                >
                  <div className="h-full rounded-2xl border-2 border-primary/20 bg-card p-5 shadow-xl md:p-8">
                    <div className="mb-4 flex items-center gap-3 border-b border-primary/10 pb-3 md:mb-6 md:pb-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground md:h-12 md:w-12 md:text-xl">
                        28
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-primary md:text-xl">Viernes</h3>
                        <p className="text-xs text-muted-foreground md:text-sm">Noviembre 2025</p>
                      </div>
                    </div>

                    <div className="space-y-3 md:space-y-4">
                      <div className="flex items-start gap-2 md:gap-3">
                        <MapPin className="mt-1 h-4 w-4 flex-shrink-0 text-secondary md:h-5 md:w-5" />
                        <div>
                          <p className="text-sm font-semibold text-foreground md:text-base">Montería - Córdoba</p>
                          <p className="text-xs text-muted-foreground md:text-sm">Pueblito Cordobés</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-2 md:gap-3">
                        <Clock className="mt-1 h-4 w-4 flex-shrink-0 text-secondary md:h-5 md:w-5" />
                        <div className="space-y-1">
                          <p className="text-xs text-foreground md:text-sm">
                            <span className="font-semibold">9:00 a.m.</span> - Inicio
                          </p>
                          <p className="text-xs text-foreground md:text-sm">
                            <span className="font-semibold">4:00 - 5:00 p.m.</span> - Parada folclórica
                          </p>
                        </div>
                      </div>

                      <div className="mt-3 rounded-lg bg-primary/5 p-3 md:mt-4 md:p-4">
                        <p className="text-xs font-medium text-foreground md:text-sm">
                          Varios eventos, incluye almuerzo
                        </p>
                      </div>

                      <div className="mt-3 rounded-lg border-l-4 border-secondary bg-secondary/5 p-3 md:mt-4 md:p-4">
                        <p className="text-xs font-semibold text-foreground md:text-sm">8:00 p.m. - Noche de Playa</p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          Traslado a Hotel San Antero (50 min aprox.)
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sábado 29 */}
                <div
                  className={`transition-all duration-1000 delay-400 ${
                    currentSlide === 1 && !isAnimating ? "translate-x-0 opacity-100" : "translate-x-12 opacity-0"
                  }`}
                >
                  <div className="h-full rounded-2xl border-2 border-secondary/20 bg-card p-5 shadow-xl md:p-8">
                    <div className="mb-4 flex items-center gap-3 border-b border-secondary/10 pb-3 md:mb-6 md:pb-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-lg font-bold text-secondary-foreground md:h-12 md:w-12 md:text-xl">
                        29
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-secondary md:text-xl">Sábado</h3>
                        <p className="text-xs text-muted-foreground md:text-sm">Noviembre 2025</p>
                      </div>
                    </div>

                    <div className="space-y-3 md:space-y-4">
                      <div className="flex items-start gap-2 md:gap-3">
                        <MapPin className="mt-1 h-4 w-4 flex-shrink-0 text-primary md:h-5 md:w-5" />
                        <div>
                          <p className="text-sm font-semibold text-foreground md:text-base">San Antero - Córdoba</p>
                          <p className="text-xs text-muted-foreground md:text-sm">Playas Hotel San Antero</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-2 md:gap-3">
                        <Clock className="mt-1 h-4 w-4 flex-shrink-0 text-primary md:h-5 md:w-5" />
                        <div className="space-y-1">
                          <p className="text-xs text-foreground md:text-sm">
                            <span className="font-semibold">9:00 a.m.</span> - Inicio
                          </p>
                          <p className="text-xs text-foreground md:text-sm">
                            <span className="font-semibold">1:00 p.m.</span> - Clausura
                          </p>
                        </div>
                      </div>

                      <div className="mt-3 rounded-lg bg-secondary/5 p-3 md:mt-4 md:p-4">
                        <p className="text-xs italic text-foreground md:text-sm">
                          Actividades de playa para afiliados alojados
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Beneficio Especial */}
              <div
                className={`transition-all duration-1000 delay-500 ${
                  currentSlide === 1 && !isAnimating ? "scale-100 opacity-100" : "scale-95 opacity-0"
                }`}
              >
                <div className="rounded-2xl border-2 border-secondary bg-gradient-to-br from-secondary/10 to-primary/5 p-5 shadow-xl md:p-8">
                  <div className="mb-3 flex items-center justify-center gap-2 md:mb-4">
                    <Sparkles className="h-5 w-5 text-secondary md:h-6 md:w-6" />
                    <h3 className="text-lg font-bold text-secondary md:text-xl">Beneficio Especial</h3>
                    <Sparkles className="h-5 w-5 text-secondary md:h-6 md:w-6" />
                  </div>
                  <p className="text-balance text-center text-sm font-semibold leading-relaxed text-foreground md:text-base lg:text-lg">
                    Los primeros 30 afiliados que confirmen asistencia recibirán una noche de alojamiento totalmente
                    gratis el viernes 28 de noviembre de 2025.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Slide 3 - Formulario de Registro */}
      <div
        className={`absolute inset-0 flex items-center justify-center transition-all duration-700 ease-in-out ${
          currentSlide === 2
            ? "translate-x-0 opacity-100"
            : direction === "next"
              ? "translate-x-full opacity-0"
              : "-translate-x-full opacity-0"
        }`}
      >
        <div className="relative h-full w-full bg-white dark:bg-white">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute left-0 top-0 h-full w-1/2 bg-gradient-to-r from-primary/8 via-primary/4 to-transparent" />
            <div className="absolute bottom-0 right-0 h-full w-1/2 bg-gradient-to-l from-secondary/8 via-secondary/4 to-transparent" />
            <div className="absolute left-[15%] top-[20%] h-48 w-48 animate-pulse rounded-full border-2 border-primary/15 opacity-40" />
            <div
              className="absolute left-[17%] top-[22%] h-40 w-40 animate-pulse rounded-full border border-primary/10 opacity-30"
              style={{ animationDelay: "1s" }}
            />
            <div
              className="absolute bottom-[25%] right-[20%] h-32 w-32 animate-pulse rounded-full border-2 border-secondary/15 opacity-40"
              style={{ animationDelay: "0.5s" }}
            />
            <div
              className="absolute bottom-[27%] right-[22%] h-24 w-24 animate-pulse rounded-full border border-secondary/10 opacity-30"
              style={{ animationDelay: "1.5s" }}
            />
            <div className="absolute right-[10%] top-[15%] h-40 w-40 rounded-full bg-gradient-to-bl from-primary/5 to-transparent blur-3xl" />
            <div className="absolute left-[10%] bottom-[20%] h-44 w-44 rounded-full bg-gradient-to-tr from-secondary/5 to-transparent blur-3xl" />
          </div>

          <div className="relative z-10 flex h-full items-center justify-center overflow-y-auto px-4 py-12 sm:px-6 md:px-8 md:py-16">
            <div className="w-full max-w-2xl">
              <div
                className={`mb-6 text-center transition-all duration-1000 delay-200 md:mb-8 ${
                  currentSlide === 2 && !isAnimating ? "translate-y-0 opacity-100" : "-translate-y-8 opacity-0"
                }`}
              >
                <div className="mb-3 flex justify-center md:mb-4">
                  <div className="inline-block rounded-full bg-secondary/10 px-4 py-1.5 md:px-6 md:py-2">
                    <p className="text-xs font-semibold uppercase tracking-wider text-secondary md:text-sm">Registro</p>
                  </div>
                </div>
                <h2 className="mb-2 font-serif text-2xl font-bold text-primary sm:text-3xl md:mb-3 md:text-4xl lg:text-5xl">
                  Confirma tu Asistencia
                </h2>
              </div>

              <div
                className={`transition-all duration-1000 delay-300 ${
                  currentSlide === 2 && !isAnimating ? "scale-100 opacity-100" : "scale-95 opacity-0"
                }`}
              >
                <div className="rounded-3xl border-2 border-primary/20 bg-card p-6 shadow-2xl sm:p-8 md:p-12">
                  {!isSubmitted ? (
                    <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8">
                      <div className="space-y-2 md:space-y-3">
                        <Label htmlFor="nombre" className="text-base font-semibold text-foreground md:text-lg">
                          Nombre Curador Urbano
                        </Label>
                        <Input
                          id="nombre"
                          type="text"
                          placeholder="Ingresa tu nombre completo"
                          value={formData.nombre}
                          onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                          required
                          className="h-12 rounded-xl border-2 border-primary/20 text-base transition-all focus:border-primary focus:ring-2 focus:ring-primary/20 md:h-14 md:text-lg"
                        />
                      </div>

                      <div className="space-y-2 md:space-y-3">
                        <Label htmlFor="numeroCurador" className="text-base font-semibold text-foreground md:text-lg">
                          Número de Despacho
                        </Label>
                        <Input
                          id="numeroCurador"
                          type="text"
                          placeholder="Ingresa tu número de curador"
                          value={formData.numeroCurador}
                          onChange={(e) => setFormData({ ...formData, numeroCurador: e.target.value })}
                          required
                          className="h-12 rounded-xl border-2 border-primary/20 text-base transition-all focus:border-primary focus:ring-2 focus:ring-primary/20 md:h-14 md:text-lg"
                        />
                      </div>

                      <div className="space-y-2 md:space-y-3">
                        <Label htmlFor="municipio" className="text-base font-semibold text-foreground md:text-lg">
                          Municipio y/o ciudad
                        </Label>
                        <Input
                          id="municipio"
                          type="text"
                          placeholder="Ingresa tu municipio"
                          value={formData.municipio}
                          onChange={(e) => setFormData({ ...formData, municipio: e.target.value })}
                          required
                          className="h-12 rounded-xl border-2 border-primary/20 text-base transition-all focus:border-primary focus:ring-2 focus:ring-primary/20 md:h-14 md:text-lg"
                        />
                      </div>

                      <Button
                        type="submit"
                        size="lg"
                        className="h-14 w-full rounded-xl bg-gradient-to-r from-primary to-secondary text-lg font-bold shadow-xl transition-all hover:scale-[1.02] hover:shadow-2xl md:h-16 md:text-xl"
                      >
                        Confirmar Asistencia
                      </Button>
                    </form>
                  ) : (
                    <div className="py-6 text-center md:py-8">
                      <div className="mb-4 flex justify-center md:mb-6">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary/20 md:h-20 md:w-20">
                          <Sparkles className="h-8 w-8 text-secondary md:h-10 md:w-10" />
                        </div>
                      </div>
                      <h3 className="mb-2 text-xl font-bold text-secondary md:mb-3 md:text-2xl">¡Registro Exitoso!</h3>
                      <p className="text-balance text-base text-muted-foreground md:text-lg">
                        Gracias por confirmar tu asistencia. Te esperamos en la celebración.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div
                className={`mt-6 flex justify-center transition-all duration-1000 delay-400 md:mt-8 ${
                  currentSlide === 2 && !isAnimating ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
                }`}
              >
                <Image
                  src="/images/30-anos-logo.png"
                  alt="30 Años"
                  width={120}
                  height={120}
                  className="h-16 w-auto opacity-60 md:h-20 lg:h-24"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-6 right-4 z-20 hidden gap-2 md:bottom-12 md:right-12 md:gap-3">
        <Button
          onClick={prevSlide}
          disabled={isAnimating}
          size="lg"
          variant="outline"
          className="h-12 w-12 rounded-full border-2 border-primary bg-background/95 p-0 shadow-xl backdrop-blur-sm transition-all hover:scale-110 hover:bg-primary hover:text-primary-foreground disabled:opacity-50 md:h-14 md:w-14"
        >
          <ChevronLeft className="h-5 w-5 md:h-6 md:w-6" />
          <span className="sr-only">Anterior</span>
        </Button>

        {currentSlide === 1 ? (
          <Button
            onClick={goToRegistration}
            disabled={isAnimating}
            size="lg"
            className="h-12 rounded-full border-2 border-secondary bg-secondary px-4 shadow-xl backdrop-blur-sm transition-all hover:scale-110 hover:bg-secondary/90 disabled:opacity-50 md:h-14 md:px-6"
          >
            <span className="text-sm font-bold md:text-base">Regístrate Ahora</span>
            <ChevronRight className="ml-1 h-4 w-4 md:ml-2 md:h-5 md:w-5" />
          </Button>
        ) : (
          <Button
            onClick={nextSlide}
            disabled={isAnimating}
            size="lg"
            variant="outline"
            className="h-12 w-12 rounded-full border-2 border-primary bg-background/95 p-0 shadow-xl backdrop-blur-sm transition-all hover:scale-110 hover:bg-primary hover:text-primary-foreground disabled:opacity-50 md:h-14 md:w-14"
          >
            <ChevronRight className="h-5 w-5 md:h-6 md:w-6" />
            <span className="sr-only">Siguiente</span>
          </Button>
        )}
      </div>

      <div className="absolute bottom-6 left-4 z-20 hidden items-center gap-2 md:bottom-12 md:left-12 md:gap-3">
        <div
          className={`h-2.5 w-2.5 rounded-full transition-all md:h-3 md:w-3 ${currentSlide === 0 ? "w-6 bg-primary md:w-8" : "bg-primary/30"}`}
        />
        <div
          className={`h-2.5 w-2.5 rounded-full transition-all md:h-3 md:w-3 ${currentSlide === 1 ? "w-6 bg-primary md:w-8" : "bg-primary/30"}`}
        />
        <div
          className={`h-2.5 w-2.5 rounded-full transition-all md:h-3 md:w-3 ${currentSlide === 2 ? "w-6 bg-primary md:w-8" : "bg-primary/30"}`}
        />
      </div>
    </div>
  )
}
