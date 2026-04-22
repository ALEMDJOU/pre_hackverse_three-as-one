import { isAuthenticated, api, clearAuthToken } from "./api.js";

if (!isAuthenticated()) {
    window.location.href = "./auth.html";
} else {
    api.getMe().then(user => {
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
            wrapper.style.cssText = 'display: flex; align-items: center; gap: 15px; margin-left: auto; background: var(--bg-secondary); padding: 5px 12px; border-radius: 999px; border: 1px solid var(--border);';

            if (user.profile_photo) {
                const img = document.createElement('img');
                img.src = user.profile_photo;
                img.alt = 'Profil';
                img.className = 'profile-avatar';
                img.style.cssText = 'width: 38px; height: 38px; border-radius: 50%; object-fit: cover; border: 2px solid #fff; box-shadow: 0 2px 8px rgba(0,0,0,0.1); cursor: pointer; transition: transform 0.2s;';
                img.onmouseenter = () => img.style.transform = 'scale(1.1)';
                img.onmouseleave = () => img.style.transform = 'scale(1)';
                img.onclick = () => window.location.href = './profile.html';
                wrapper.appendChild(img);
            }
            
            const logoutBtn = document.createElement('button');
            logoutBtn.innerHTML = 'Déconnexion';
            logoutBtn.style.cssText = 'background: transparent; border: none; color: #4b5563; font-weight: 600; padding: 6px 10px; font-size: 0.82rem; cursor: pointer; transition: color 0.2s;';
            logoutBtn.onmouseenter = () => logoutBtn.style.color = 'var(--primary)';
            logoutBtn.onmouseleave = () => logoutBtn.style.color = '#4b5563';
            logoutBtn.onclick = () => {
                clearAuthToken();
                window.location.href = '../index.html';
            };
            
            wrapper.appendChild(logoutBtn);
            container.appendChild(wrapper);
        });
    }).catch(console.error);
}
