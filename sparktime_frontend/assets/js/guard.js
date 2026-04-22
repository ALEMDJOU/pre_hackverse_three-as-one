import { isAuthenticated, api, clearAuthToken } from "./api.js";

async function checkSession() {
    // Vérification locale rapide
    if (!isAuthenticated()) {
        window.location.href = "../index.html";
        return;
    }

    try {
        // Chargement silencieux des infos utilisateur
        const user = await api.getMe();
        
        const currentPath = window.location.pathname;
        document.querySelectorAll('.app-header .container').forEach(container => {
            // Mise en valeur du menu actif
            container.querySelectorAll('.desktop-nav a').forEach(link => {
                const href = link.getAttribute('href');
                if (href && currentPath.includes(href)) {
                    link.classList.add('active');
                }
            });

            // Injection du menu utilisateur (avatar + déconnexion)
            if (!container.querySelector('.user-menu')) {
                const wrapper = document.createElement('div');
                wrapper.className = 'user-menu';
                wrapper.style.cssText = 'display: flex; align-items: center; gap: 12px; margin-left: auto; background: var(--bg-secondary); padding: 4px 10px; border-radius: 999px; border: 1px solid var(--border);';

                if (user.profile_photo) {
                    const img = document.createElement('img');
                    img.src = user.profile_photo;
                    img.alt = 'Profil';
                    img.style.cssText = 'width: 32px; height: 32px; border-radius: 50%; object-fit: cover; border: 1.5px solid #fff; cursor: pointer;';
                    img.onclick = () => window.location.href = './profile.html';
                    wrapper.appendChild(img);
                }
                
                const logoutBtn = document.createElement('button');
                logoutBtn.innerHTML = 'Déconnexion';
                logoutBtn.style.cssText = 'background: transparent; border: none; color: #4b5563; font-weight: 600; padding: 4px 8px; font-size: 0.8rem; cursor: pointer;';
                logoutBtn.onclick = () => {
                    clearAuthToken();
                    window.location.href = '../index.html';
                };
                
                wrapper.appendChild(logoutBtn);
                container.appendChild(wrapper);
            }
        });

    } catch (error) {
        console.error("Session invalide:", error);
        clearAuthToken();
        window.location.href = "../index.html";
    }
}

// On lance la vérification sans bloquer l'affichage
checkSession();
