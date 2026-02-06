#!/bin/bash

# setup.sh - Hacienda Pro - Configuración del Entorno (Linux/macOS)

echo "🚀 Iniciando configuración de Hacienda Pro..."

# Verificar si node y npm están instalados
if ! command -v node &> /dev/null
then
    echo "❌ Error: Node.js no está instalado. Por favor, instálalo desde https://nodejs.org/"
    exit 1
fi

echo "📦 Instalando dependencias..."
npm install

if [ $? -eq 0 ]; then
    echo "✅ Instalación completada con éxito."
    echo "🖥️ Para iniciar el servidor de desarrollo, ejecuta: npm run dev"
else
    echo "⚠️ Hubo un problema al instalar las dependencias. Verifica tu conexión a internet."
fi
