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

    try {
        const data = await api.login({ email, password });
        setAuthToken(data?.token || data?.access_token || data?.accessToken);
        window.location.href = "./dashboard.html";
    } catch (error) {
        alert(error.message || "Connexion impossible pour le moment. Verifiez que l'endpoint /auth/login existe cote backend.");
    }
});

signupForm?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const fullName = document.getElementById("signup-name").value.trim();
    const email = document.getElementById("signup-email").value.trim();
    const password = document.getElementById("signup-password").value;

    try {
        const data = await api.register({ full_name: fullName, email, password });
        setAuthToken(data?.access_token || data?.token || data?.accessToken);
        alert("Compte cree avec succes. Vous pouvez vous connecter.");
        window.location.href = "./dashboard.html";
    } catch (error) {
        alert(error.message || "Inscription impossible pour le moment.");
    }
});
