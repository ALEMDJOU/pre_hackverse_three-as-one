import { isAuthenticated, api, clearAuthToken } from "./api.js";

// Empêche le flash de contenu non-autorisé dès le départ
const css = '.auth-protected { opacity: 0 !important; }';
const style = document.createElement('style');
style.appendChild(document.createTextNode(css));
document.head.appendChild(style);

async function checkSession() {
    // Vérification locale immédiate
    if (!isAuthenticated()) {
        window.location.href = "./auth.html";
        return;
    }

    // On attend que le body soit là pour injecter le loader
    if (!document.body) {
        window.requestAnimationFrame(checkSession);
        return;
    }

    const loader = document.createElement('div');
    loader.className = 'full-page-loader';
    loader.innerHTML = '<span class="spinner" style="width: 40px; height: 40px; border-width: 4px; border-top-color: var(--primary);"></span><p style="margin-top: 15px; font-weight: 600; color: var(--text-dark);">Vérification de la session...</p>';
    document.body.prepend(loader);
    document.body.classList.add('auth-protected');

    try {
        const user = await api.getMe();
        
        // Session valide ! On prépare l'interface
        const currentPath = window.location.pathname;
        document.querySelectorAll('.app-header .container').forEach(container => {
            // Mise en valeur du menu actif
            container.querySelectorAll('.desktop-nav a').forEach(link => {
                if (currentPath.includes(link.getAttribute('href'))) {
                    link.classList.add('active');
                }
            });

            const wrapper = document.createElement('div');
            wrapper.className = 'user-menu';
            wrapper.style.cssText = 'display: flex; align-items: center; gap: 12px; margin-left: auto; background: var(--bg-secondary); padding: 4px 10px; border-radius: 999px; border: 1px solid var(--border);';

            if (user.profile_photo) {
                const img = document.createElement('img');
                img.src = user.profile_photo;
                img.alt = 'Profil';
                img.style.cssText = 'width: 32px; height: 32px; border-radius: 50%; object-fit: cover; border: 1.5px solid #fff; cursor: pointer; transition: transform 0.2s;';
                img.onmouseenter = () => img.style.transform = 'scale(1.1)';
                img.onmouseleave = () => img.style.transform = 'scale(1)';
                img.onclick = () => window.location.href = './profile.html';
                wrapper.appendChild(img);
            }
            
            const logoutBtn = document.createElement('button');
            logoutBtn.innerHTML = 'Déconnexion';
            logoutBtn.style.cssText = 'background: transparent; border: none; color: #4b5563; font-weight: 600; padding: 4px 8px; font-size: 0.8rem; cursor: pointer; transition: color 0.2s;';
            logoutBtn.onmouseenter = () => logoutBtn.style.color = 'var(--primary)';
            logoutBtn.onmouseleave = () => logoutBtn.style.color = '#4b5563';
            logoutBtn.onclick = () => {
                clearAuthToken();
                window.location.href = '../index.html';
            };
            
            wrapper.appendChild(logoutBtn);
            container.appendChild(wrapper);
        });

        // Tout est prêt, on affiche !
        loader.classList.add('hidden');
        document.body.classList.add('verified');
        setTimeout(() => loader.remove(), 400);

    } catch (error) {
        console.error("Session invalide:", error);
        clearAuthToken();
        window.location.href = "./auth.html";
    }
}

checkSession();
