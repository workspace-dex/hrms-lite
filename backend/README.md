# HRMS Lite Backend

FastAPI-based backend for HRMS Lite application.

## Quick Start

```bash
# Setup
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Run
cp .env.example .env
# Edit .env with your database credentials
uvicorn app.main:app --reload
```

## API Documentation

- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Deployment

See render.yaml for Render deployment configuration.
