
# AR CONTROL LIVE STUDIO (ARCLS) v7.0

**AR CONTROL LIVE STUDIO** es un Sistema Operativo Broadcast Profesional diseñado para la producción deportiva y eventos de alta exigencia en tiempo real. Integra un Switcher de Video clase ATEM y un Mixer de Audio DSP profesional en un solo núcleo ultra-portátil.

Desarrollado por **ChrisRey91** • [www.arcontrolinteligente.com](https://www.arcontrolinteligente.com)

## 🧩 Arquitectura de Motores (Safe-First)

El sistema se basa en el principio **"Audio jamás degrada el PGM"**. Si el procesamiento de audio detecta estrés, se auto-ajusta para proteger la señal de salida sin interrumpir el flujo visual.

### 🎥 Motor de Video (Professional Switcher)
*   **Preview/Program Real:** Arquitectura de doble bus para transiciones broadcast (Cut, Mix, Wipe).
*   **Multiview Dinámico:** Monitoreo simultáneo de hasta 8 fuentes NDI/SRT/USB.
*   **Safe Zones:** Capas de protección 16:9 y 9:16 para redes sociales.

### 🔊 Motor de Audio DSP (Master Hub)
*   **Master Limiter (P0):** Hard-coded a -1dBFS, imposible de apagar ON-AIR para evitar distorsión digital.
*   **Auto Gain Guard (P0):** Reducción automática de ganancia tras detectar 3 picos en 1 segundo.
*   **Mic Master Lock:** Bloqueo de canales críticos para prevenir errores humanos del operador.

### 🏟️ Sports & Rules Engine
*   **MultiSport Rules:** Motor de lógica para Fútbol, Béisbol, Básquet y más, con gestión de marcadores y eventos reglamentarios.
*   **Replay Buffer:** Memoria circular de 5 a 20 segundos para repeticiones instantáneas en cámara lenta.

### 🤖 Gemini AI Production Copilot
*   **Análisis Táctico:** IA que analiza frames en tiempo real para sugerir cambios de cámara.
*   **Live Commerce:** Detección de SKU por voz y comentarios para adjudicación automática de ventas en streamings comerciales.

---

## 🛠️ Instalación y Requisitos
*   **Platform:** Android / Web (Optimizado para hardware de alto rendimiento).
*   **Core:** React + TypeScript + Google Gemini API.
*   **Networking:** Soporta NDI High Bandwidth, SRT (Caller/Listener) y RTMP Multicast.

---
© 2024 AR CONTROL INTELLIGENTE. Todos los derechos reservados.
