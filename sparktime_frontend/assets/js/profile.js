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
        alert("Profil mis a jour.");
    } catch (error) {
        alert(error.message || "Mise a jour impossible.");
    }
});

photoForm?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const file = photoFileInput.files?.[0];
    if (!file) return;
    try {
        const data = await api.uploadProfilePhoto(file);
        if (data.profile_photo) {
            preview.src = data.profile_photo;
            preview.style.display = "block";
        }
    } catch (error) {
        alert(error.message || "Upload impossible.");
    }
});

loadProfile().catch((error) => alert(error.message || "Chargement profil impossible."));
