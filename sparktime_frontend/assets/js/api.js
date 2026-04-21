import { APP_CONFIG } from "./config.js";

const TOKEN_KEY = "sparktime_token";

function getApiBaseUrl() {
    return window.__APP_ENV__?.API_BASE_URL || APP_CONFIG.API_BASE_URL;
}

export function getAuthToken() {
    return localStorage.getItem(TOKEN_KEY);
}

export function setAuthToken(token) {
    if (token) localStorage.setItem(TOKEN_KEY, token);
}

export function clearAuthToken() {
    localStorage.removeItem(TOKEN_KEY);
}

export function isAuthenticated() {
    return Boolean(getAuthToken());
}

async function request(path, options = {}) {
    const token = getAuthToken();
    const response = await fetch(`${getApiBaseUrl()}${path}`, {
        headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...(options.headers || {})
        },
        ...options
    });

    if (!response.ok) {
        if (response.status === 401) {
            clearAuthToken();
            // On ne redirige pas si on est déjà sur la page d'accueil ou de login
            if (!window.location.pathname.includes("auth.html") && !window.location.pathname.endsWith("/")) {
                window.location.href = window.location.pathname.includes("/pages/") ? "./auth.html" : "pages/auth.html";
            }
        }
        let message = "Erreur API";
        try {
            const data = await response.json();
            message = data.detail || data.message || message;
        } catch (_) {
            // Keep default message if JSON cannot be parsed.
        }
        throw new Error(message);
    }

    if (response.status === 204) return null;
    return response.json();
}

export const api = {
    login: (payload) =>
        request("/auth/login", {
            method: "POST",
            body: JSON.stringify(payload)
        }),
    register: (payload) =>
        request("/auth/register", {
            method: "POST",
            body: JSON.stringify(payload)
        }),
    getMe: () => request("/users/me"),
    updateMe: (payload) =>
        request("/users/me", {
            method: "PUT",
            body: JSON.stringify(payload)
        }),
    uploadProfilePhoto: async (file) => {
        const token = getAuthToken();
        const formData = new FormData();
        formData.append("file", file);
        const response = await fetch(`${getApiBaseUrl()}/users/me/photo`, {
            method: "POST",
            headers: token ? { Authorization: `Bearer ${token}` } : {},
            body: formData
        });
        if (!response.ok) throw new Error("Upload de photo impossible.");
        return response.json();
    },
    getTasks: () => request("/tasks"),
    getTask: (taskId) => request(`/tasks/${taskId}`),
    createTask: (payload) =>
        request("/tasks/", {
            method: "POST",
            body: JSON.stringify(payload)
        }),
    updateTask: (taskId, payload) =>
        request(`/tasks/${taskId}`, {
            method: "PUT",
            body: JSON.stringify(payload)
        }),
    deleteTask: (taskId) =>
        request(`/tasks/${taskId}`, {
            method: "DELETE"
        }),
    aiChat: (prompt) =>
        request("/ai/chat", {
            method: "POST",
            body: JSON.stringify({ prompt })
        })
};
