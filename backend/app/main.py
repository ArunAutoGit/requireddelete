from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.database import engine, Base
from app.model import usermaster
from app.routes import auth, coupon, kpi_routes, msr_visit, payout_webhooks, users, productmaster, redeem, report, asset, analytics, payments, payouts, printer
from app.routes import otp as routes_auth

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI()

# CORS Configuration - Allow all for development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],        
    allow_credentials=False,    
    allow_methods=["*"],        
    allow_headers=["*"],       
)

# Include routers
app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(users.router)
app.include_router(productmaster.router)
app.include_router(coupon.router)
app.include_router(redeem.router)
app.include_router(kpi_routes.router)

app.include_router(routes_auth.router)
app.include_router(report.router)
app.include_router(asset.router) 
app.include_router(analytics.router)
app.include_router(msr_visit.router)
app.include_router(payments.router)
app.include_router(payout_webhooks.router)
app.include_router(payouts.router)
app.include_router(printer.router, tags=["printer"])
