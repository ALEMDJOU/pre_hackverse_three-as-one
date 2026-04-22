import { api } from "./api.js";

const form = document.getElementById("profile-form");
const photoForm = document.getElementById("profile-photo-form");
const nameInput = document.getElementById("profile-name");
const emailInput = document.getElementById("profile-email");
const photoFileInput = document.getElementById("profile-photo-file");
const preview = document.getElementById("profile-photo-preview");

async function loadProfile() {
    const me = await api.getMe();
    nameInput.value = me.full_name || "";
    emailInput.value = me.email || "";
    if (me.profile_photo) {
        preview.src = me.profile_photo;
        preview.style.display = "block";
    }
}

form?.addEventListener("submit", async (e) => {
    e.preventDefault();
    try {
        const updated = await api.updateMe({ full_name: nameInput.value.trim() });
        nameInput.value = updated.full_name || "";
        showToast("Profil mis a jour avec succès.", "success");
    } catch (error) {
        showToast(error.message || "Mise a jour impossible.", "error");
    }
});

photoFileInput?.addEventListener("change", async () => {
    const file = photoFileInput.files?.[0];
    if (!file) return;

    try {
        // Optionnel : un petit indicateur de chargement local si besoin
        showToast("Chargement de la nouvelle photo...", "info");
        const data = await api.uploadProfilePhoto(file);
        if (data.profile_photo) {
            preview.src = data.profile_photo;
            preview.style.display = "block";
            showToast("Photo de profil mise à jour !", "success");
            
            // Recharger la page ou mettre à jour les autres avatars si nécessaire
            setTimeout(() => window.location.reload(), 1000);
        }
    } catch (error) {
        showToast(error.message || "Impossible de charger la photo.", "error");
    }
});

loadProfile().catch((error) => showToast(error.message || "Chargement profil impossible.", "error"));
