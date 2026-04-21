const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";

// Configuration globale dynamique pour un déploiement simple (0 configuration)
export const APP_CONFIG = {
    API_BASE_URL: isLocal ? "http://127.0.0.1:8000" : "https://api.sparktime.app" // En production, mettez l'URL de votre API Render/Heroku etc
};
