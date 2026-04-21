# ✨ Sparktime PWA - Assistant Personnel pour Étudiants

Sparktime est une Progressive Web App (PWA) conçue pour aider les étudiants à gérer leur emploi du temps, leurs devoirs et leur productivité grâce à une interface moderne et un assistant intelligent motorisé par **Groq (Llama 3)**.

## 🚀 Fonctionnalités Clés

- **Authentification Sécurisée** : Gestion des comptes avec JWT, validation des emails et mot de passe (avec option visuelle 👁️).
- **Gestion des Tâches** : Création, modification et suppression de tâches avec priorisation (Urgent, Haute, Moyenne, Basse) et estimations de temps.
- **Planning Dynamique** : Vue hebdomadaire automatisée triant les tâches par échéance chronologique.
- **Profil Utilisateur** : Personnalisation avec photo de profil stockée en base de données.
- **Assistant IA (✨ Sparktime IA)** : Un bouton flottant disponible sur le dashboard pour discuter avec un coach d'organisation. L'IA a accès au contexte de vos tâches pour vous conseiller en temps réel.
- **UI/UX Moderne** : Design glassmorphique, notifications Toasts fluides et animations de chargement.

---

## 🛠️ Installation et Lancement

### 1. Backend (FastAPI + SQLite)
Le backend gère la base de données, la sécurité et sert de proxy pour l'IA.

1. Allez dans le dossier : `cd sparktime_backend`
2. Installez les dépendances : `pip install -r requirements.txt` (Assurez-vous d'avoir `fastapi`, `uvicorn`, `sqlalchemy`, `python-jose`, `bcrypt`, `python-dotenv`)
3. Configurez le fichier `.env` :
   ```env
   DATABASE_URL=sqlite:///./sparktime.db
   SECRET_KEY=votre_cle_jwt_aleatoire
   GROQ_API_KEY=votre_cle_groq_ici
   ```
4. Lancez le serveur :
   `uvicorn main:app --reload --port 8000`

### 2. Frontend (HTML/JS/Vanilla CSS)
Le frontend est léger et ne nécessite pas de compilation (Vite/Webpack).

1. Allez dans le dossier : `cd sparktime_frontend`
2. Lancez un serveur Web local :
   `python3 -m http.server 5500`
3. Accédez à l'application via : `http://localhost:5500`

---

## 🔒 Sécurité et IA

- **CORS** : Le backend est configuré pour accepter les requêtes du port `5500` (configurable via `ALLOWED_ORIGINS`).
- **Proxy IA** : La clé API Groq n'est **jamais** exposée au frontend. Les requêtes passent par une route backend protégée `/ai/chat`.
- **Confidentialité** : Les données sont stockées localement via SQLite.

## 🧠 Configuration de l'Assistant IA
Pour que l'assistant fonctionne, vous devez posséder une clé API chez [Groq](https://console.groq.com/). Insérez-la dans le `.env` du backend. L'assistant utilisera le modèle `llama3-8b-8192` pour des réponses instantanées.

---

### 📝 Notes pour les Développeurs
- Les routes sont protégées par le middleware `get_current_user`.
- Le frontend utilise `api.js` pour centraliser tous les appels fetch.
- Les notifications utilisent le système global `window.showToast(message, type)`.

