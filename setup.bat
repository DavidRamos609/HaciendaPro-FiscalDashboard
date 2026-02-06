@echo off
:: setup.bat - Hacienda Pro - Configuración del Entorno (Windows)

echo 🚀 Iniciando configuracion de Hacienda Pro...

:: Verificar si node y npm estan instalados
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Error: Node.js no esta instalado. Por favor, instalalo desde https://nodejs.org/
    pause
    exit /b 1
)

echo 📦 Instalando dependencias...
call npm install

if %errorlevel% equ 0 (
    echo ✅ Instalacion completada con exito.
    echo 🖥️ Para iniciar el servidor de desarrollo, ejecuta: npm run dev
) else (
    echo ⚠️ Hubo un problema al instalar las dependencias. Verifica tu conexion a internet.
)

pause
