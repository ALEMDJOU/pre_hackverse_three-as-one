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

            if (user.profile_photo) {
                const img = document.createElement('img');
                img.src = user.profile_photo;
                img.alt = 'Profil';
                img.className = 'profile-avatar';
                img.onclick = () => window.location.href = './profile.html';
                wrapper.appendChild(img);
            }
            
            const logoutBtn = document.createElement('button');
            logoutBtn.innerHTML = 'Déconnexion';
            logoutBtn.className = 'btn-logout';
            logoutBtn.onclick = () => {
                clearAuthToken();
                window.location.href = '../index.html';
            };
            
            wrapper.appendChild(logoutBtn);
            container.appendChild(wrapper);
        });
    }).catch(console.error);
}
