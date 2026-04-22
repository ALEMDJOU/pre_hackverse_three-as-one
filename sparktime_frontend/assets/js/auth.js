import { api, setAuthToken, isAuthenticated } from "./api.js";

const loginForm = document.getElementById("login-form");
const signupForm = document.getElementById("signup-form");
const showSignup = document.getElementById("show-signup");
const showLogin = document.getElementById("show-login");
const authTitle = document.getElementById("auth-title");
const authSubtitle = document.getElementById("auth-subtitle");

if (isAuthenticated()) {
    window.location.href = "./dashboard.html";
}

function setMode(mode) {
    const login = mode === "login";
    loginForm.classList.toggle("hidden", !login);
    signupForm.classList.toggle("hidden", login);
    authTitle.textContent = login ? "Bon retour !" : "Créer votre compte";
    authSubtitle.textContent = login
        ? "Connectez-vous pour gérer votre temps."
        : "Inscrivez-vous et commencez a planifier.";
}

const urlParams = new URLSearchParams(window.location.search);
const initialMode = urlParams.get('mode') || 'login';
setMode(initialMode);

showSignup?.addEventListener("click", (e) => {
    e.preventDefault();
    setMode("signup");
});

showLogin?.addEventListener("click", (e) => {
    e.preventDefault();
    setMode("login");
});

loginForm?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("login-email").value.trim();
    const password = document.getElementById("login-password").value;
    const submitBtn = loginForm.querySelector('button[type="submit"]');
    submitBtn.classList.add("btn-loading");

    try {
        const data = await api.login({ email, password });
        setAuthToken(data?.token || data?.access_token || data?.accessToken);
        showToast("Connexion réussie ! Redirection...", "success");
        setTimeout(() => window.location.href = "./dashboard.html", 300);
    } catch (error) {
        showToast(error.message || "Connexion impossible pour le moment.", "error");
    } finally {
        submitBtn.classList.remove("btn-loading");
    }
});

signupForm?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const fullName = document.getElementById("signup-name").value.trim();
    const email = document.getElementById("signup-email").value.trim();
    const password = document.getElementById("signup-password").value;
    const passwordConfirm = document.getElementById("signup-password-confirm").value;
    const photoInput = document.getElementById("signup-photo");
    
    const submitBtn = signupForm.querySelector('button[type="submit"]');
    
    if (password !== passwordConfirm) {
        showToast("Les mots de passe ne correspondent pas.", "error");
        return;
    }
    
    let base64Photo = undefined;
    submitBtn.classList.add("btn-loading");

    try {
        if (photoInput.files && photoInput.files[0]) {
            const file = photoInput.files[0];
            base64Photo = await new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => resolve(reader.result);
                reader.onerror = reject;
                reader.readAsDataURL(file);
            });
        }

        const data = await api.register({ 
            full_name: fullName, 
            email, 
            password,
            profile_photo: base64Photo
        });
        
        setAuthToken(data.access_token);
        showToast("Compte créé avec succès ! Bienvenue.", "success");
        setTimeout(() => window.location.href = "./dashboard.html", 300);
    } catch (error) {
        showToast(error.message || "Inscription impossible pour le moment.", "error");
    } finally {
        submitBtn.classList.remove("btn-loading");
    }
});

// Gestion de la visibilité des mots de passe
document.querySelectorAll(".password-toggle").forEach(btn => {
    btn.addEventListener("click", () => {
        const input = btn.previousElementSibling;
        if (input.type === "password") {
            input.type = "text";
            btn.innerHTML = "🙈";
        } else {
            input.type = "password";
            btn.innerHTML = "👁️";
        }
    });
});
