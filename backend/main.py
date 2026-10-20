import os
import time
import uuid
import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request, Response, status, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.base import BaseHTTPMiddleware
from sqlalchemy import text
import database
from database import Base, engine, SessionLocal
import models
from routers import auth, customer, admin, public
import seed
import accounting

# Configure structured logging
logger = logging.getLogger("royal_bull.api")
logger.setLevel(logging.INFO)

class StructuredLoggingMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        req_id = request.headers.get("X-Correlation-ID") or f"req_{uuid.uuid4().hex[:12]}"
        start_time = time.perf_counter()
        request.state.correlation_id = req_id

        response = await call_next(request)

        duration_ms = (time.perf_counter() - start_time) * 1000
        response.headers["X-Correlation-ID"] = req_id
        response.headers["X-Response-Time-Ms"] = f"{duration_ms:.2f}"

        # Emit structured log
        if not request.url.path.startswith("/health/liveness"):
            print(
                f'{{"time":"{time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())}",'
                f'"correlation_id":"{req_id}",'
                f'"method":"{request.method}",'
                f'"path":"{request.url.path}",'
                f'"status_code":{response.status_code},'
                f'"duration_ms":{duration_ms:.2f}}}'
            )
        return response

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Ensure database schema is created
    Base.metadata.create_all(bind=engine)
    # Check if empty database, if so, seed baseline data
    db = SessionLocal()
    try:
        user_count = db.query(models.User).count()
        if user_count == 0:
            print("Database empty. Seeding initial Royal Bull Capital baseline data...")
            seed.reset_and_seed_production_data(db)
    finally:
        db.close()
    yield
    # Shutdown

app = FastAPI(
    title="Royal Bull Capital API",
    description="Enterprise-grade Forex Referral, 10-Tier Commission Engine, and Simulated Trading Platform API",
    version="2.0.0",
    lifespan=lifespan
)

# Structured request logging
app.add_middleware(StructuredLoggingMiddleware)

# CORS configuration
allowed_origins_env = os.getenv("ALLOWED_ORIGINS", "*")
allowed_origins = [o.strip() for o in allowed_origins_env.split(",") if o.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins if allowed_origins != ["*"] else ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount routers
app.include_router(public.router)
app.include_router(auth.router)
app.include_router(customer.router)
app.include_router(admin.router)

@app.get("/health", tags=["System"])
@app.get("/api/health", tags=["System"])
def health_check():
    return {
        "status": "healthy",
        "service": "Royal Bull Capital API",
        "environment": os.getenv("ENVIRONMENT", "production"),
        "database_dialect": engine.dialect.name,
        "demo_mode": False,
        "version": "2.0.0"
    }

@app.get("/health/liveness", tags=["System"])
def liveness_check():
    """Kubernetes / cloud process liveness probe."""
    return {"status": "alive"}

@app.get("/health/readiness", tags=["System"])
def readiness_check():
    """
    Kubernetes / cloud readiness probe:
    - Tests database query connectivity (SELECT 1)
    - Verifies double-entry general ledger trial balance
    """
    db = SessionLocal()
    try:
        # 1. Test live DB query
        db.execute(text("SELECT 1"))

        # 2. Verify trial balance
        tb = accounting.verify_trial_balance(db)
        if not tb["is_balanced"]:
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail=f"Ledger trial balance out of balance by {tb['difference_cents']} cents."
            )

        return {
            "status": "ready",
            "database": "connected",
            "database_dialect": engine.dialect.name,
            "trial_balance_balanced": True,
            "total_debits_cents": tb["total_debits_cents"],
            "total_credits_cents": tb["total_credits_cents"]
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=f"Readiness check failed: {str(e)}"
        )
    finally:
        db.close()

@app.get("/health/version", tags=["System"])
def version_check():
    """Reports deployed build metadata, environment, and persistence configuration."""
    return {
        "version": "2.0.0",
        "commit": os.getenv("GIT_COMMIT", "c5d92c1"),
        "branch": os.getenv("GIT_BRANCH", "feature/production-hardening"),
        "environment": os.getenv("ENVIRONMENT", "production"),
        "database_backend": engine.dialect.name,
        "persistent_storage": engine.dialect.name != "sqlite" or not str(database.DATABASE_URL).startswith("sqlite:///:memory:")
    }

