#!/bin/bash
# Hacienda Pro - Linux Launcher
echo "🚀 Iniciando Hacienda Pro (Servidor Local)..."
# Ir al directorio donde está el script
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$DIR" || exit
# Intentar abrir el navegador en paralelo
(sleep 2 && xdg-open http://localhost:8080) &
# Ejecutar servidor Python
python3 -m http.server 8080
