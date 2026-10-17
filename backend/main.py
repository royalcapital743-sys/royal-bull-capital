import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import Base, engine, SessionLocal
import models
from routers import auth, customer, admin, public
import seed

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
        "environment": "production-ready",
        "demo_mode": False,
        "version": "2.0.0"
    }
