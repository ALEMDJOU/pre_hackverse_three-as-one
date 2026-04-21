import { api } from "./api.js";

const summaryEl = document.getElementById("dashboard-summary");
const priorityListEl = document.getElementById("dashboard-priority-list");

function taskWeight(task) {
    const priorityRank = { urgent: 4, high: 3, medium: 2, low: 1 };
    return priorityRank[task.priority] || 0;
}

async function loadDashboard() {
    try {
        const tasks = await api.getTasks();
        const pending = tasks.filter((t) => t.status !== "done");
        const urgent = tasks.filter((t) => t.priority === "urgent" && t.status !== "done");

        summaryEl.textContent = `${urgent.length} urgente(s), ${pending.length} en cours, ${tasks.length} total.`;

        const top = [...pending].sort((a, b) => taskWeight(b) - taskWeight(a)).slice(0, 4);
        priorityListEl.innerHTML = "";

        if (top.length === 0) {
            priorityListEl.innerHTML = "<li>Aucune tache prioritaire pour l'instant.</li>";
            return;
        }

        top.forEach((task) => {
            const li = document.createElement("li");
            li.innerHTML = `${task.title} <span class="chip">${task.priority}</span>`;
            priorityListEl.appendChild(li);
        });
    } catch (error) {
        summaryEl.textContent = error.message || "Chargement dashboard impossible.";
        priorityListEl.innerHTML = "<li>Erreur de chargement.</li>";
    }
}

loadDashboard();
