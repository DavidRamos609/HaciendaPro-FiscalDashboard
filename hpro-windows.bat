@echo off
title Hacienda Pro Launcher
echo 🚀 Iniciando Hacienda Pro (Servidor Local)...
start "" http://localhost:8080
python -m http.server 8080
pause
