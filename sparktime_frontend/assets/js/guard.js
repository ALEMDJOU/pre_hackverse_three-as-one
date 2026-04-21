import { isAuthenticated, api, clearAuthToken } from "./api.js";

if (!isAuthenticated()) {
    window.location.href = "./auth.html";
} else {
    api.getMe().then(user => {
        document.querySelectorAll('.app-header .container').forEach(container => {
            const wrapper = document.createElement('div');
            wrapper.style.cssText = 'display: flex; align-items: center; gap: 15px; margin-left: auto;';

            // Si la nav est là on la pousse un peu à gauche
            const nav = container.querySelector('.desktop-nav');
            if (nav) nav.style.marginRight = '20px';

            if (user.profile_photo) {
                const img = document.createElement('img');
                img.src = user.profile_photo;
                img.alt = user.full_name || 'Profil';
                img.style.cssText = 'width: 42px; height: 42px; border-radius: 50%; object-fit: cover; border: 2px solid var(--color-primary); cursor: pointer;';
                img.onclick = () => window.location.href = './profile.html';
                wrapper.appendChild(img);
            }
            
            const logoutBtn = document.createElement('button');
            logoutBtn.innerHTML = 'Déconnexion';
            logoutBtn.className = 'btn';
            logoutBtn.style.cssText = 'background: white; border: 1px solid #d1d5db; color: #4b5563; padding: 8px 14px; font-size: 0.85rem;';
            logoutBtn.onmouseenter = () => logoutBtn.style.background = '#f3f4f6';
            logoutBtn.onmouseleave = () => logoutBtn.style.background = 'white';
            logoutBtn.onclick = () => {
                clearAuthToken();
                window.location.href = '../index.html';
            };
            
            wrapper.appendChild(logoutBtn);
            container.appendChild(wrapper);
        });
    }).catch(console.error);
}
