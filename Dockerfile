FROM python:3.11-slim

WORKDIR /app

# Copiar requirements del backend
COPY backend/requirements.txt ./backend/

# Instalar dependencias
RUN pip install --no-cache-dir -r backend/requirements.txt

# Copiar todo el código
COPY backend/ ./backend/
COPY *.html ./

# Variables de entorno
ENV PYTHONUNBUFFERED=1
ENV PORT=8000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD python -c "import requests; requests.get('http://localhost:8000/health')" || exit 1

# Exponer puerto
EXPOSE 8000

# Comando de inicio
CMD ["uvicorn", "backend.main:app", "--host", "0.0.0.0", "--port", "8000"]
