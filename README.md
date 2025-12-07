
# DevSuite: Herramientas Digitales Integrales

![PWA Ready](https://img.shields.io/badge/PWA-Ready-purple.svg?style=flat-square)
![License](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)
![React](https://img.shields.io/badge/React-19-cyan.svg?style=flat-square)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue.svg?style=flat-square)
![Build](https://img.shields.io/badge/Build-Esbuild-orange.svg?style=flat-square)

**DevSuite** es una "navaja suiza" digital para desarrolladores y creativos. Una aplicación web progresiva (PWA) que reúne herramientas de conversión, criptografía, diseño y manipulación de datos en una interfaz moderna, rápida y capaz de funcionar sin conexión.

🔗 **Demo en vivo:** [https://dev-suite.vercel.app/](https://dev-suite.vercel.app/)

---

## 🔒 Privacidad y Arquitectura

DevSuite está construida con una filosofía **"Privacy-First"** y **"Client-Side Only"**.

*   **Sin Backend:** Toda la lógica de conversión, generación de hashes y procesamiento de datos ocurre localmente en tu navegador.
*   **BYOK (Bring Your Own Key):** Para las funciones de Inteligencia Artificial (Gemini), la aplicación no almacena credenciales en el servidor. Tú ingresas tu propia API Key en la configuración, la cual se guarda de forma segura y encriptada en el `localStorage` de tu navegador y se usa exclusivamente para comunicarse directamente con Google.
*   **100% Offline:** Gracias a su Service Worker con estrategia *Stale-While-Revalidate*, la aplicación carga instantáneamente y funciona sin conexión a internet (excepto herramientas de Red e IA).

---

## 🚀 Características Principales

### 🎨 UI/UX Profesional
-   **Sistema de Temas:** Modo Oscuro/Claro automático y selector de color de acento personalizable (Presets o Hex).
-   **Diseño Responsivo:** Interfaz adaptada a móviles, tablets y escritorio.
-   **Historial Persistente:** Panel lateral que guarda automáticamente tus cálculos y resultados.

### 🛠️ Herramientas Incluidas

#### 1. Editor de Diagramas (Mermaid + IA) 🆕
Entorno completo para crear diagramas de flujo, secuencia y más.
-   **Editor Híbrido:** Alterna entre código con resaltado de sintaxis y modo básico.
-   **Visualización Interactiva:** Zoom inteligente, paneo (arrastrar lienzo) y descarga SVG.
-   **Asistencia IA:** Funciones para "Autocorregir" errores de sintaxis, "Mejorar" el diseño o "Explicar" el diagrama.

#### 2. Conversor Universal
Unificación de conversores físicos y utilitarios.
-   **Categorías:** Longitud (inc. Píxeles), Masa, Volumen, Área, Velocidad, Tiempo y Almacenamiento Digital.
-   **Salud:** **Calculadora IMC** integrada con estándares OMS y asiáticos, visualización de rangos y riesgos.
-   **Precisión:** Manejo de notación científica y actualización reactiva.

#### 3. Asistente IA (Gemini 2.5 Flash)
-   **Chat Técnico:** Consultas de código, generación de Regex y explicación de algoritmos.
-   **Streaming:** Respuestas en tiempo real con renderizado de Markdown y bloques de código.

#### 4. Conversor de Datos
-   **Formatos:** Conversión bidireccional entre **JSON**, **YAML** y **TOML**.
-   **Editor:** Validación de sintaxis, importación de archivos locales y descarga de resultados.

#### 5. Criptografía y Seguridad
-   **Hash Generator:** MD5, SHA-1, SHA-256, SHA-512, BLAKE3 y RIPEMD-160.
-   **Cifrado:** Encriptación/Desencriptación de texto con AES, Rabbit y RC4.
-   **Archivos:** Hashing de archivos locales sin subida al servidor (límite 200MB).

#### 6. Bases y Codificación
-   **Bases:** Conversión reactiva entre Decimal, Binario y Hexadecimal (BigInt).
-   **Codificación:** Texto a Base64, Bytes Hex, Binario Stream y URL/HTML Encoding.

#### 7. Red y Sistema
-   **Network Tools:** Mi IP, Ping (simulado vía HTTP Head), DNS Lookup, Escáner de Puertos (limitado por navegador) y Calculadora de Subredes (IPv4).
-   **Sistema:** User Agent Parser, Tiempo Unix y Generador UUID (v1, v4, v7).

#### 8. Diseño y Color
-   **Paletas:** Generador de armonías (Análoga, Triádica, etc.) y psicología del color.
-   **Gradientes:** Generador visual de CSS lineal y radial.

---

## 💻 Stack Tecnológico

-   **Frontend:** [React 19](https://react.dev/)
-   **Lenguaje:** [TypeScript](https://www.typescriptlang.org/)
-   **Estilos:** [Tailwind CSS](https://tailwindcss.com/)
-   **Empaquetado:** [Esbuild](https://esbuild.github.io/) (Configuración manual optimizada)
-   **IA SDK:** Google GenAI SDK for Web
-   **Gráficos:** Mermaid.js

---

## ⚙️ Instalación y Desarrollo Local

1.  **Clonar el repositorio:**
    ```bash
    git clone https://github.com/tu-usuario/devsuite.git
    cd devsuite
    ```

2.  **Instalar dependencias:**
    ```bash
    npm install
    ```

3.  **Iniciar en modo desarrollo:**
    ```bash
    npm run dev
    ```
    Abre `http://127.0.0.1:8000` en tu navegador. El comando compila el CSS y JS en tiempo real.

4.  **Construir para Producción:**
    ```bash
    npm run build
    ```
    Esto generará los archivos optimizados en la carpeta `public/`.

## ☁️ Despliegue en Vercel

Este proyecto está pre-configurado para Vercel.

1.  Sube el código a GitHub.
2.  Importa el proyecto en Vercel.
3.  La configuración de construcción (`npm run build`) se detectará automáticamente.
4.  **Nota:** No necesitas configurar variables de entorno (`.env`) en Vercel, ya que la API Key se gestiona desde el lado del cliente.

---

**Creado por [4N0N1M0](https://github.com/ANONIMO432HZ)**
