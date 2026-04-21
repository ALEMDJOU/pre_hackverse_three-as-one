const menuButton = document.querySelector(".mobile-menu-toggle");
const mobileNav = document.querySelector(".mobile-nav");
const header = document.querySelector("header");
const progressBar = document.querySelector(".scroll-progress");

if (menuButton && mobileNav) {
    menuButton.addEventListener("click", () => {
        mobileNav.classList.toggle("open");
    });
}

const observer = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("active");
            }
        });
    },
    { threshold: 0.15 }
);

document.querySelectorAll(".animate-in, .animate-card").forEach((el) => observer.observe(el));

function updateHeaderState() {
    if (!header) return;
    header.classList.toggle("scrolled", window.scrollY > 50);
}

function updateProgressBar() {
    if (!progressBar) return;
    const doc = document.documentElement;
    const scrollable = doc.scrollHeight - window.innerHeight;
    const progress = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
    progressBar.style.width = `${Math.min(100, Math.max(0, progress))}%`;
}

window.addEventListener("scroll", () => {
    updateHeaderState();
    updateProgressBar();
});

updateHeaderState();
updateProgressBar();

document.querySelectorAll(".btn-glow").forEach((button) => {
    button.addEventListener("mousemove", (event) => {
        const rect = button.getBoundingClientRect();
        const x = event.clientX - rect.left - rect.width / 2;
        const y = event.clientY - rect.top - rect.height / 2;
        button.style.transform = `translate(${x * 0.04}px, ${y * 0.04}px)`;
    });

    button.addEventListener("mouseleave", () => {
        button.style.transform = "";
    });
});

setTimeout(() => {
    document.querySelectorAll(".skeleton").forEach((el) => el.classList.remove("skeleton"));
}, 700);

// Global Toast System
window.showToast = function(message, type = "success") {
    let container = document.getElementById("toast-container");
    if (!container) {
        container = document.createElement("div");
        container.id = "toast-container";
        document.body.appendChild(container);
    }
    
    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;
    toast.innerText = message;
    
    container.appendChild(toast);
    
    setTimeout(() => {
        toast.classList.add("hide");
        toast.addEventListener("animationend", () => {
            toast.remove();
        });
    }, 4000);
};
