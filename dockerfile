# --- Stage 1: Build Frontend ---
FROM oven/bun:latest AS frontend-builder
WORKDIR /build/frontend
COPY frontend/package.json frontend/bun.lock ./
RUN bun install
COPY frontend/ .
RUN bun run build 

# --- Stage 2: Final Image ---
FROM python:3.12-slim-trixie
COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/

WORKDIR /app

# Copy dependency files first for caching
COPY uv.lock pyproject.toml ./
RUN uv sync --frozen --no-cache

# Copy Backend and Migrations
COPY backend/ ./backend/
COPY alembic/ ./alembic/
COPY alembic.ini .

# Copy built frontend from Stage 1 into the expected location
COPY --from=frontend-builder /build/frontend/dist ./frontend/dist

# Create database directory and expose port
RUN mkdir -p /app/database
EXPOSE 8000

# Declare /app/database as a volume for data persistence
VOLUME ["/app/database"]

# Set environment variables
ENV SERVE_FRONTEND=True
ENV PYTHONPATH=/app/backend
ENV DATABASE_URL=sqlite:////app/database/secrets.db

# Start Uvicorn pointing to the backend module
# We run as a module to handle imports correctly
CMD ["uv", "run", "python", "-m", "uvicorn", "backend.main:app", "--host", "0.0.0.0", "--port", "8000"]