from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base
from routers import auth, users, tasks, ai

# Création des tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Sparktime API", version="1.0")

# CORS (très important pour frontend HTML/JS)

import os

# Liste dynamique des URLs autorisées (déploiement simple)
# Par défaut "*", sinon on sépare par des virgules (ex: "http://sparktime.app,https://frontend.com")
allowed_origins_env = os.getenv("ALLOWED_ORIGINS", "*")
origins = [origin.strip() for origin in allowed_origins_env.split(",")] if allowed_origins_env != "*" else ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(users.router)
app.include_router(tasks.router)
app.include_router(ai.router)

@app.get("/")
def root():
    return {"message": "Sparktime API is running 🚀"}