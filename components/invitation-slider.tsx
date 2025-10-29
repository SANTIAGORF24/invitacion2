"use client";

import type React from "react";

import { useState, useEffect } from "react";
import {
  ChevronRight,
  ChevronLeft,
  MapPin,
  Clock,
  Calendar,
  Sparkles,
  User,
  Hash,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { supabase } from "@/lib/supabase";

export default function InvitationSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState<"next" | "prev">("next");
  const [isAnimating, setIsAnimating] = useState(false);
  const [showElements, setShowElements] = useState({
    logo: false,
    title: false,
    subtitle: false,
    logo30: false,
    dates: false,
    location: false,
    button: false,
    sideImage: false,
  });

  // Estados del formulario
  const [loading, setLoading] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const [formData, setFormData] = useState({
    nombre: "",
    numero_despacho: "",
    municipio: "",
  });

  const nextSlide = () => {
    if (isAnimating) return;
    setDirection("next");
    setIsAnimating(true);
    // Saltar del slide 1 al 3 (omitir el 2)
    setCurrentSlide((prev) => {
      if (prev === 0) return 2; // Del slide 1 (index 0) al slide 3 (index 2)
      if (prev === 2) return 3; // Del slide 3 al slide 4
      if (prev === 3) return 0; // Del slide 4 de vuelta al slide 1
      return (prev + 1) % 4;
    });
  };

  const prevSlide = () => {
    if (isAnimating) return;
    setDirection("prev");
    setIsAnimating(true);
    // Saltar del slide 3 al 1 (omitir el 2)
    setCurrentSlide((prev) => {
      if (prev === 2) return 0; // Del slide 3 (index 2) al slide 1 (index 0)
      if (prev === 3) return 2; // Del slide 4 al slide 3
      if (prev === 0) return 3; // Del slide 1 de vuelta al slide 4
      return (prev - 1 + 4) % 4;
    });
  };

  useEffect(() => {
    if (isAnimating) {
      const timer = setTimeout(() => setIsAnimating(false), 800);
      return () => clearTimeout(timer);
    }
  }, [isAnimating]);

  // Funciones del formulario
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    
    // Si es el campo numero_despacho, solo permitir números
    if (name === "numero_despacho") {
      const soloNumeros = value.replace(/\D/g, "")
      setFormData({
        ...formData,
        [name]: soloNumeros,
      })
    } else {
      setFormData({
        ...formData,
        [name]: value,
      })
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Permitir: backspace, delete, tab, escape, enter, flechas
    const allowedKeys = ['Backspace', 'Delete', 'Tab', 'Escape', 'Enter', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown']
    
    // Si es una tecla permitida o Ctrl/Cmd + A/C/V/X, permitir
    if (allowedKeys.includes(e.key) || 
        (e.ctrlKey || e.metaKey) && ['a', 'c', 'v', 'x'].includes(e.key.toLowerCase())) {
      return
    }
    
    // Si no es un número, prevenir la acción
    if (!/^[0-9]$/.test(e.key)) {
      e.preventDefault()
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nombre || !formData.numero_despacho || !formData.municipio) {
      alert("Por favor complete todos los campos");
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.from("asistencias").insert([
        {
          nombre: formData.nombre,
          numero_despacho: formData.numero_despacho,
          municipio: formData.municipio,
          fecha_registro: new Date().toISOString(),
        },
      ]);

      if (error) {
        console.error("Error al registrar:", error);
        alert("Error al registrar su asistencia. Por favor intente nuevamente.");
        return;
      }

      setEnviado(true);
      
      // Volver al primer slide después de 3 segundos
      setTimeout(() => {
        setEnviado(false);
        setFormData({
          nombre: "",
          numero_despacho: "",
          municipio: "",
        });
        setCurrentSlide(0);
      }, 3000);
    } catch (err) {
      console.error("Error inesperado:", err);
      alert("Error al registrar su asistencia. Por favor intente nuevamente.");
    } finally {
      setLoading(false);
    }
  };

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
      });

      // Animación secuencial con timers
      const timers = [
        setTimeout(
          () => setShowElements((prev) => ({ ...prev, logo: true })),
          100
        ),
        setTimeout(
          () => setShowElements((prev) => ({ ...prev, title: true })),
          400
        ),
        setTimeout(
          () => setShowElements((prev) => ({ ...prev, subtitle: true })),
          900
        ),
        setTimeout(
          () => setShowElements((prev) => ({ ...prev, logo30: true })),
          1400
        ),
        setTimeout(
          () => setShowElements((prev) => ({ ...prev, dates: true })),
          1900
        ),
        setTimeout(
          () => setShowElements((prev) => ({ ...prev, location: true })),
          2200
        ),
        setTimeout(
          () => setShowElements((prev) => ({ ...prev, button: true })),
          2500
        ),
        setTimeout(
          () => setShowElements((prev) => ({ ...prev, sideImage: true })),
          1500
        ),
      ];

      return () => timers.forEach((timer) => clearTimeout(timer));
    }
  }, [currentSlide]);

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-white dark:bg-white">
      {currentSlide === 0 && (
        <div
          className={`absolute left-1/2 top-4 z-30 -translate-x-1/2 md:top-8 lg:left-auto lg:right-8 lg:translate-x-0 transition-all duration-1000 ${
            showElements.logo
              ? "opacity-100 translate-y-0"
              : "opacity-0 -translate-y-8"
          }`}
        >
          <Image
            src="/images/cncu-logo.webp"
            alt="Colegio Nacional de Curadores Urbanos"
            width={180}
            height={80}
            className="h-auto w-60 drop-shadow-lg sm:w-56 md:w-52 lg:w-56 xl:w-60"
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
            {/* Fondo limpio sin elementos decorativos */}
          </div>

          <div className="relative z-10 flex h-full items-center justify-center overflow-y-auto px-3 py-12 sm:px-6 sm:py-16 md:px-12 md:py-8 lg:px-24">
            <div className="w-full max-w-4xl">
              <div className="space-y-6 text-center sm:space-y-8 md:space-y-10 lg:space-y-12">
                {/* Registro de Asistencia */}
                <div
                  className={`space-y-2 transition-all duration-1000 md:space-y-3 ${
                    showElements.title
                      ? "translate-y-0 opacity-100"
                      : "-translate-y-8 opacity-0"
                  }`}
                >
                  <h2 className="pt-5 text-balance font-serif text-2xl font-bold text-primary sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl">
                    Registro de Asistencia
                  </h2>
                </div>

                {/* Texto TREINTA AÑOS */}
                <div
                  className={`transition-all duration-1000 delay-300 ${
                    showElements.subtitle
                      ? "translate-y-0 opacity-100"
                      : "translate-y-8 opacity-0"
                  }`}
                >
                  <p className="text-balance font-serif text-xl font-bold leading-tight text-primary sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl">
                    TREINTA AÑOS DE LA FIGURA DEL<br />CURADOR URBANO EN COLOMBIA
                  </p>
                </div>

                {/* Logo 30 años */}
                <div
                  className={`flex justify-center transition-all duration-1000 delay-600 ${
                    showElements.logo30
                      ? "scale-100 opacity-100"
                      : "scale-75 opacity-0"
                  }`}
                >
                  <Image
                    src="/images/30-anos-logo.png"
                    alt="30 Años Curador Urbano"
                    width={300}
                    height={300}
                    className="h-40 w-auto sm:h-48 md:h-56 lg:h-64 xl:h-72"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Slide 2 - Notas Importantes */}
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
          </div>

          <div className="relative z-10 flex h-full items-center justify-center overflow-y-auto px-4 py-8 sm:px-6 md:px-12 md:py-12 lg:px-24">
            <div className="w-full max-w-4xl space-y-4 md:space-y-6">
              <div
                className={`text-center transition-all duration-1000 delay-200 ${
                  currentSlide === 1 && !isAnimating
                    ? "translate-y-0 opacity-100"
                    : "-translate-y-8 opacity-0"
                }`}
              >
                <div className="mb-4 flex justify-center md:mb-5">
                  <div className="rounded-full bg-gradient-to-br from-secondary to-primary p-4 shadow-2xl md:p-5">
                    <Sparkles className="h-8 w-8 text-white md:h-10 md:w-10" />
                  </div>
                </div>
                <h2 className="mb-3 font-serif text-2xl font-bold text-secondary sm:text-3xl md:text-4xl lg:text-5xl">
                  Notas Importantes
                </h2>
              </div>

              <div
                className={`transition-all duration-1000 delay-400 ${
                  currentSlide === 1 && !isAnimating
                    ? "scale-100 opacity-100"
                    : "scale-95 opacity-0"
                }`}
              >
                <div className="space-y-3 md:space-y-4">
                  <div className="rounded-2xl border-2 border-secondary/30 bg-gradient-to-br from-secondary/10 to-primary/5 p-4 shadow-xl md:p-6">
                    <div className="mb-2 flex items-center gap-2 md:mb-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-base font-bold text-white md:h-10 md:w-10 md:text-lg">
                        1
                      </div>
                      <Sparkles className="h-5 w-5 text-secondary md:h-6 md:w-6" />
                    </div>
                    <p className="text-sm leading-relaxed text-foreground text-justify md:text-base lg:text-lg">
                      Los primeros 30 curadores urbanos miembros del Colegio Nacional de Curadores Urbanos que confirmen su asistencia mediante el formulario de inscripción recibirán la noche de alojamiento del viernes 28 de noviembre de 2025 gratuita, siempre y cuando se encuentren a paz y salvo hasta el mes de octubre.
                    </p>
                  </div>

                  <div className="rounded-2xl border-2 border-primary/30 bg-gradient-to-br from-primary/10 to-secondary/5 p-4 shadow-xl md:p-6">
                    <div className="mb-2 flex items-center gap-2 md:mb-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-base font-bold text-white md:h-10 md:w-10 md:text-lg">
                        2
                      </div>
                      <Sparkles className="h-5 w-5 text-primary md:h-6 md:w-6" />
                    </div>
                    <p className="text-sm leading-relaxed text-foreground text-justify md:text-base lg:text-lg">
                      El beneficio de alojamiento para la noche del 28 de noviembre de 2025 no aplica para los miembros de la Junta Directiva.
                    </p>
                  </div>

                  <div className="rounded-2xl border-2 border-secondary/30 bg-gradient-to-br from-secondary/10 to-primary/5 p-4 shadow-xl md:p-6">
                    <div className="mb-2 flex items-center gap-2 md:mb-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-base font-bold text-white md:h-10 md:w-10 md:text-lg">
                        3
                      </div>
                      <Sparkles className="h-5 w-5 text-secondary md:h-6 md:w-6" />
                    </div>
                    <p className="text-sm leading-relaxed text-foreground text-justify md:text-base lg:text-lg">
                      Para la noche de celebración del viernes 28 de noviembre cada curador podrá asistir con un acompañante mayor de edad.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Slide 3 - Programa del Evento */}
      <div
        className={`absolute inset-0 flex items-center justify-center transition-all duration-700 ease-in-out ${
          currentSlide === 2
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
          </div>

          <div className="relative z-10 flex h-full items-center justify-center overflow-y-auto px-4 py-8 sm:px-6 md:px-12 lg:px-24">
            <div className="w-full max-w-6xl space-y-4 md:space-y-6">
              <div
                className={`text-center transition-all duration-1000 delay-200 ${
                  currentSlide === 2 && !isAnimating
                    ? "translate-y-0 opacity-100"
                    : "-translate-y-8 opacity-0"
                }`}
              >
                <h2 className="mb-2 font-serif text-2xl font-bold text-primary sm:text-3xl md:text-4xl lg:text-5xl">
                  Programa del Evento
                </h2>
              </div>

              <div className="grid grid-cols-1 gap-4 md:gap-6">
                {/* Viernes 28 */}
                <div
                  className={`transition-all duration-1000 delay-300 ${
                    currentSlide === 2 && !isAnimating
                      ? "translate-x-0 opacity-100"
                      : "-translate-x-12 opacity-0"
                  }`}
                >
                  <div className="rounded-2xl border-2 border-primary/20 bg-card p-4 shadow-xl md:p-6">
                    <div className="mb-3 flex items-center gap-3 border-b border-primary/10 pb-3 md:mb-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground md:h-12 md:w-12">
                        28
                      </div>
                        <div>
                        <h3 className="text-base font-bold text-primary md:text-lg">
                          Viernes 28 de noviembre
                        </h3>
                        <p className="text-xs text-muted-foreground md:text-sm">
                          Lugar: Auditorio Pueblito Cordobés – Montería
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-2 text-xs md:grid-cols-2 md:text-sm">
                      <div className="flex gap-2">
                        <Clock className="mt-0.5 h-3 w-3 flex-shrink-0 text-secondary md:h-4 md:w-4" />
                        <div>
                          <span className="font-semibold">8:30 a.m.</span> Registro de asistencia
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Clock className="mt-0.5 h-3 w-3 flex-shrink-0 text-secondary md:h-4 md:w-4" />
                        <div>
                          <span className="font-semibold">9:00 a.m.</span> Saludo de Bienvenida – Presidente del CNCU
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Clock className="mt-0.5 h-3 w-3 flex-shrink-0 text-secondary md:h-4 md:w-4" />
                        <div>
                          <span className="font-semibold">9:15 a.m.</span> Palabras Autoridades Locales
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Clock className="mt-0.5 h-3 w-3 flex-shrink-0 text-secondary md:h-4 md:w-4" />
                        <div>
                          <span className="font-semibold">9:30 a.m.</span> Intervención Ministerio de Vivienda, Ciudad y Territorio
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Clock className="mt-0.5 h-3 w-3 flex-shrink-0 text-secondary md:h-4 md:w-4" />
                        <div>
                          <span className="font-semibold">9:50 a.m.</span> Intervención Superintendencia de Notariado y Registro
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Clock className="mt-0.5 h-3 w-3 flex-shrink-0 text-secondary md:h-4 md:w-4" />
                        <div>
                          <span className="font-semibold">10:15 a.m.</span> Coffee Break
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Clock className="mt-0.5 h-3 w-3 flex-shrink-0 text-secondary md:h-4 md:w-4" />
                        <div>
                          <span className="font-semibold">10:45 a.m.</span> Relato Primer Curador y Miembro Fundador CNCU - Arq. Farid Numa Hernández, Expresidente CNCU
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Clock className="mt-0.5 h-3 w-3 flex-shrink-0 text-secondary md:h-4 md:w-4" />
                        <div>
                          <span className="font-semibold">12:00 m.</span> Almuerzo
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Clock className="mt-0.5 h-3 w-3 flex-shrink-0 text-secondary md:h-4 md:w-4" />
                        <div>
                          <span className="font-semibold">1:30 p.m.</span> El Presente del Curador Urbano – Arq. William Taboada Díaz, Presidente del CNCU
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Clock className="mt-0.5 h-3 w-3 flex-shrink-0 text-secondary md:h-4 md:w-4" />
                        <div>
                          <span className="font-semibold">2:30 p.m.</span> Reconocimiento Primeros Curadores Urbanos
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Clock className="mt-0.5 h-3 w-3 flex-shrink-0 text-secondary md:h-4 md:w-4" />
                        <div>
                          <span className="font-semibold">3:00 p.m. a 4:00 p.m.</span> Parada Folclórica ¨Pueblito Cordobés¨
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Clock className="mt-0.5 h-3 w-3 flex-shrink-0 text-secondary md:h-4 md:w-4" />
                        <div>
                          <span className="font-semibold">5:00 p.m. a 6:00 p.m.</span> Recorrido ¨Ronda del Sinú¨
                        </div>
                      </div>
                        <div className="col-span-full flex gap-2 rounded-lg bg-secondary/10 p-2">
                        <Clock className="mt-0.5 h-3 w-3 flex-shrink-0 text-secondary md:h-4 md:w-4" />
                        <div>
                          <span className="font-semibold">7:30 p.m.</span> Noche ¨Sinuana¨<span className="font-bold">*</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sábado 29 */}
                <div
                  className={`transition-all duration-1000 delay-400 ${
                    currentSlide === 2 && !isAnimating
                      ? "translate-x-0 opacity-100"
                      : "translate-x-12 opacity-0"
                  }`}
                >
                  <div className="rounded-2xl border-2 border-secondary/20 bg-card p-4 shadow-xl md:p-6">
                    <div className="mb-3 flex items-center gap-3 border-b border-secondary/10 pb-3 md:mb-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-lg font-bold text-secondary-foreground md:h-12 md:w-12">
                        29
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-secondary md:text-lg">
                          Sábado 29 de noviembre
                        </h3>
                      </div>
                    </div>

                      <div className="flex items-start gap-2 text-xs md:text-sm">
                      <Clock className="mt-0.5 h-3 w-3 flex-shrink-0 text-primary md:h-4 md:w-4" />
                      <div>
                        <span className="font-semibold">9:00 a.m. a 1 p.m.</span> Actividad de Integración – Ida a San Antero (Playa)
                      </div>
                    </div>
                  </div>
                </div>

                {/* Nota Importante */}
                <div
                  className={`transition-all duration-1000 delay-500 ${
                    currentSlide === 2 && !isAnimating
                      ? "translate-y-0 opacity-100"
                      : "translate-y-8 opacity-0"
                  }`}
                >
                  <div className="rounded-2xl bg-white border-2 border-primary/40 p-5 md:p-6 shadow-lg">
                    <div className="flex items-start gap-3">
                      <span className="text-2xl md:text-3xl font-bold text-primary shrink-0">*</span>
                      <p className="text-sm md:text-base lg:text-lg text-primary leading-relaxed font-semibold">
                        Para la noche de celebración del viernes 28 de noviembre cada curador podrá asistir con un acompañante mayor de edad.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Slide 4 - Confirmación */}
      <div
        className={`absolute inset-0 flex items-center justify-center transition-all duration-700 ease-in-out ${
          currentSlide === 3
            ? "translate-x-0 opacity-100"
            : direction === "next"
            ? "-translate-x-full opacity-0"
            : "translate-x-full opacity-0"
        }`}
      >
        <div className="relative h-full w-full bg-gradient-to-br from-primary/5 via-white to-secondary/5 dark:from-primary/5 dark:via-white dark:to-secondary/5">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute left-0 top-0 h-full w-1/2 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent" />
            <div className="absolute bottom-0 right-0 h-1/2 w-full bg-gradient-to-t from-secondary/10 via-secondary/5 to-transparent" />
            <div className="absolute left-[10%] top-[20%] h-64 w-64 animate-pulse rounded-full border border-primary/20 opacity-20" />
            <div
              className="absolute right-[10%] bottom-[25%] h-56 w-56 animate-pulse rounded-full border border-secondary/20 opacity-20"
              style={{ animationDelay: "0.5s" }}
            />
          </div>

          <div className="relative z-10 flex h-full items-center justify-center overflow-y-auto px-4 py-12 sm:px-6 md:px-12 md:py-16 lg:px-24">
            <div className="w-full max-w-3xl space-y-8 md:space-y-12">
              <div
                className={`text-center transition-all duration-1000 delay-200 ${
                  currentSlide === 2 && !isAnimating
                    ? "translate-y-0 opacity-100"
                    : "-translate-y-8 opacity-0"
                }`}
              >
                <div className="mb-6 flex justify-center">
                  <div className="rounded-full bg-gradient-to-br from-primary to-secondary p-6 shadow-2xl">
                    <Sparkles className="h-12 w-12 text-white md:h-16 md:w-16" />
                  </div>
                </div>
                <h2 className="mb-4 font-serif text-3xl font-bold text-primary sm:text-4xl md:text-5xl lg:text-6xl">
                  ¡Confirme su Participación!
                </h2>
                <p className="text-balance text-lg leading-relaxed text-foreground md:text-xl lg:text-2xl">
                  Confirme su participación diligenciando el siguiente formulario
                </p>
              </div>

              <div
                className={`transition-all duration-1000 delay-400 ${
                  currentSlide === 2 && !isAnimating
                    ? "scale-100 opacity-100"
                    : "scale-95 opacity-0"
                }`}
              >
                <div className="rounded-3xl border-2 border-primary/20 bg-card p-8 shadow-2xl md:p-12">
                  <div className="space-y-6">
                    <div className="flex items-center justify-center gap-3">
                      <div className="h-1 w-12 rounded-full bg-gradient-to-r from-transparent to-primary" />
                      <Calendar className="h-8 w-8 text-primary" />
                      <div className="h-1 w-12 rounded-full bg-gradient-to-l from-transparent to-primary" />
                    </div>
                    
                    <p className="text-center text-base text-muted-foreground md:text-lg">
                      Complete el registro para asegurar su lugar en este evento especial
                    </p>

                    <div className="flex justify-center pt-4">
                      <Button
                        size="lg"
                        className="group relative overflow-hidden bg-gradient-to-r from-primary to-secondary px-8 py-6 text-lg font-bold text-white shadow-2xl transition-all duration-300 hover:scale-105 hover:shadow-primary/50 md:px-12 md:py-8 md:text-xl"
                        onClick={nextSlide}
                      >
                        <span className="relative z-10 flex items-center gap-3">
                          Registro de participación
                          <ChevronRight className="h-5 w-5 transition-transform group-hover:translate-x-1 md:h-6 md:w-6" />
                        </span>
                        <div className="absolute inset-0 -z-0 bg-gradient-to-r from-secondary to-primary opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                      </Button>
                    </div>

                    <div className="mt-8 rounded-xl bg-secondary/10 p-4 md:p-6">
                      <p className="text-center text-sm italic text-muted-foreground md:text-base">
                        Recuerde: Los primeros 30 asociados que confirmen recibirán alojamiento gratuito
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Slide 4 - Formulario de Registro */}
      <div
        className={`absolute inset-0 flex items-center justify-center transition-all duration-700 ease-in-out ${
          currentSlide === 3
            ? "translate-x-0 opacity-100"
            : direction === "next"
            ? "-translate-x-full opacity-0"
            : "translate-x-full opacity-0"
        }`}
      >
        <div className="relative h-full w-full bg-gradient-to-br from-primary/5 via-white to-secondary/5 dark:from-primary/5 dark:via-white dark:to-secondary/5">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute left-0 top-0 h-full w-1/2 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent" />
            <div className="absolute bottom-0 right-0 h-1/2 w-full bg-gradient-to-t from-secondary/10 via-secondary/5 to-transparent" />
          </div>

          <div className="relative z-10 flex h-full items-center justify-center overflow-y-auto px-4 py-8 sm:px-6 md:px-12 lg:px-24">
            {enviado ? (
              <div className="w-full max-w-md text-center">
                <div
                  className={`transition-all duration-1000 ${
                    currentSlide === 3 && !isAnimating
                      ? "scale-100 opacity-100"
                      : "scale-95 opacity-0"
                  }`}
                >
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
                      Nos vemos el 28 y 29 de noviembre en Montería.
                    </p>
                    <div className="mt-6 rounded-xl bg-green-50 p-4">
                      <p className="text-xs italic text-green-700">
                        Redirigiendo al inicio...
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="w-full max-w-2xl">
                <div
                  className={`mb-6 text-center transition-all duration-1000 delay-200 ${
                    currentSlide === 3 && !isAnimating
                      ? "translate-y-0 opacity-100"
                      : "-translate-y-8 opacity-0"
                  }`}
                >
                  <div className="mb-4 flex justify-center">
                    <div className="rounded-full bg-gradient-to-br from-primary to-secondary p-4 shadow-2xl md:p-6">
                      <Sparkles className="h-10 w-10 text-white md:h-12 md:w-12" />
                    </div>
                  </div>
                  <h2 className="mb-3 font-serif text-2xl font-bold text-primary md:text-3xl lg:text-4xl">
                    Registro de Participación
                  </h2>
                  <p className="text-base text-muted-foreground md:text-lg">
                    Celebración 30 Años del Curador Urbano
                  </p>
                  <div className="mx-auto mt-3 flex max-w-xl flex-col gap-2 text-sm text-foreground sm:flex-row sm:justify-center sm:gap-4">
                    <span className="flex items-center justify-center gap-2">
                      <Calendar className="h-4 w-4 text-primary" />
                      28-29 Noviembre 2025
                    </span>
                    <span className="flex items-center justify-center gap-2">
                      <MapPin className="h-4 w-4 text-secondary" />
                      Montería, Córdoba
                    </span>
                  </div>
                </div>

                <div
                  className={`transition-all duration-1000 delay-400 ${
                    currentSlide === 3 && !isAnimating
                      ? "scale-100 opacity-100"
                      : "scale-95 opacity-0"
                  }`}
                >
                  <div className="rounded-3xl border-2 border-primary/20 bg-white p-6 shadow-2xl md:p-8">
                    <form onSubmit={handleSubmit} className="space-y-5">
                      <div className="space-y-2">
                        <Label htmlFor="nombre" className="flex items-center gap-2 text-sm font-semibold text-foreground md:text-base">
                          <User className="h-4 w-4 text-primary md:h-5 md:w-5" />
                          Nombre Completo *
                        </Label>
                        <Input
                          id="nombre"
                          name="nombre"
                          type="text"
                          value={formData.nombre}
                          onChange={handleChange}
                          required
                          disabled={loading}
                          className="h-11 text-sm md:h-12 md:text-base"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="numero_despacho" className="flex items-center gap-2 text-sm font-semibold text-foreground md:text-base">
                          <Hash className="h-4 w-4 text-primary md:h-5 md:w-5" />
                          Número de Despacho *
                        </Label>
                        <Input
                          id="numero_despacho"
                          name="numero_despacho"
                          type="text"
                          inputMode="numeric"
                          pattern="[0-9]*"
                          placeholder="Ej: 123"
                          value={formData.numero_despacho}
                          onChange={handleChange}
                          onKeyDown={handleKeyDown}
                          required
                          disabled={loading}
                          className="h-11 text-sm md:h-12 md:text-base"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="municipio" className="flex items-center gap-2 text-sm font-semibold text-foreground md:text-base">
                          <MapPin className="h-4 w-4 text-primary md:h-5 md:w-5" />
                          Municipio/Ciudad *
                        </Label>
                        <Input
                          id="municipio"
                          name="municipio"
                          type="text"
                          value={formData.municipio}
                          onChange={handleChange}
                          required
                          disabled={loading}
                          className="h-11 text-sm md:h-12 md:text-base"
                        />
                      </div>

                      <Button
                        type="submit"
                        disabled={loading}
                        className="h-12 w-full bg-gradient-to-r from-primary to-secondary text-base font-bold text-white shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-primary/50 md:h-14 md:text-lg"
                      >
                        {loading ? "Registrando..." : "Confirmar Participación"}
                      </Button>

                      <div className="text-center">
                        <p className="text-xs text-muted-foreground">
                          * Todos los campos son obligatorios
                        </p>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="absolute bottom-6 right-4 z-20 flex gap-2 md:bottom-12 md:right-12 md:gap-3">
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
      </div>

      <div className="absolute bottom-6 left-4 z-20 flex items-center gap-2 md:bottom-12 md:left-12 md:gap-3">
        <div
          className={`h-2.5 w-2.5 rounded-full transition-all md:h-3 md:w-3 ${
            currentSlide === 0 ? "w-6 bg-primary md:w-8" : "bg-primary/30"
          }`}
        />
        <div
          className={`h-2.5 w-2.5 rounded-full transition-all md:h-3 md:w-3 ${
            currentSlide === 1 ? "w-6 bg-primary md:w-8" : "bg-primary/30"
          }`}
        />
        <div
          className={`h-2.5 w-2.5 rounded-full transition-all md:h-3 md:w-3 ${
            currentSlide === 2 ? "w-6 bg-primary md:w-8" : "bg-primary/30"
          }`}
        />
        <div
          className={`h-2.5 w-2.5 rounded-full transition-all md:h-3 md:w-3 ${
            currentSlide === 3 ? "w-6 bg-primary md:w-8" : "bg-primary/30"
          }`}
        />
      </div>
    </div>
  );
}
