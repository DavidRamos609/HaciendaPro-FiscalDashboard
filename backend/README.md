# IRPF 2025 · Sistema Familiar · Comunidad de Madrid

## Estructura de archivos

```
irpf2025/
├── irpf2025_familia.html       ← App principal (declarantes + entrevistas + Modelo 100)
├── irpf2025_documentos.html    ← Módulo de gastos, ingresos y familia numerosa
└── backend/
    ├── main.py                 ← Proxy FastAPI (20 líneas)
    ├── requirements.txt
    └── .env                    ← Tu API key (NO subir a git)
```

## Instalación del backend (una sola vez)

```bash
cd backend
pip install -r requirements.txt
```

## Configurar la API key

Edita `backend/.env`:
```
ANTHROPIC_API_KEY=sk-ant-tu-clave-aqui
```

Obtén tu clave en: https://console.anthropic.com → API Keys

## Arrancar el servidor

```bash
cd backend
uvicorn main:app --reload --port 3001
```

Verás: `Uvicorn running on http://127.0.0.1:3001`

## Usar la aplicación

1. Con el servidor arrancado, abre `irpf2025_familia.html` en Chrome
2. El indicador superior derecho debe mostrar **"Conectado ✓"** en verde
3. Para el módulo de documentos, pulsa "📎 Documentos Fiscales" o abre `irpf2025_documentos.html`

## Script de arranque rápido (Windows)

Crea `arrancar.bat` en la carpeta raíz:
```bat
@echo off
cd backend
start uvicorn main:app --port 3001
timeout /t 2
start irpf2025_familia.html
```

## Script de arranque rápido (Mac/Linux)

Crea `arrancar.sh`:
```bash
#!/bin/bash
cd backend
uvicorn main:app --port 3001 &
sleep 2
open irpf2025_familia.html  # Mac
# xdg-open irpf2025_familia.html  # Linux
```

## Coste

El backend usa tu API key de Anthropic.
- Claude Sonnet 4: ~$0.003 por 1K tokens entrada, ~$0.015 por 1K tokens salida
- Una entrevista completa: ~$0.15-0.25
- Con $10 de créditos: 40-60 declaraciones completas

## Seguridad

- La API key vive solo en `.env` en tu PC
- El backend solo acepta conexiones locales (localhost)
- Nunca subas `.env` a git (ya está en .gitignore)
