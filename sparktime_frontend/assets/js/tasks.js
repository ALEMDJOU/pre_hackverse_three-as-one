import { api } from "./api.js";

const form = document.getElementById("task-form");
const list = document.getElementById("task-list");

function renderTasks(tasks) {
    list.innerHTML = "";
    if (!tasks.length) {
        list.innerHTML = "<li>Aucune tache.</li>";
        return;
    }

    tasks.forEach((task) => {
        const li = document.createElement("li");
        let extraInfo = "";
        if (task.due_date) {
            const dateStr = new Date(task.due_date).toLocaleString();
            extraInfo += `<span style="font-size: 0.85em; opacity: 0.8; margin-right: 8px;">⏰ ${dateStr}</span>`;
        }
        if (task.estimated_minutes) {
            extraInfo += `<span style="font-size: 0.85em; opacity: 0.8;">⏱️ ${task.estimated_minutes} min</span>`;
        }

        li.innerHTML = `
            <strong>${task.title}</strong> <span class="chip">${task.priority}</span>
            <div>${task.description || ""}</div>
            <div style="margin-top: 4px;">${extraInfo}</div>
            <div style="margin-top:8px; display:flex; gap:8px;">
                <button class="btn btn-primary" data-action="done" data-id="${task.id}" type="button">Marquer done</button>
                <button class="btn" data-action="delete" data-id="${task.id}" type="button">Supprimer</button>
            </div>
        `;
        list.appendChild(li);
    });
}

async function refresh() {
    const tasks = await api.getTasks();
    renderTasks(tasks);
}

form?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const title = document.getElementById("task-title").value.trim();
    const description = document.getElementById("task-description").value.trim();
    const rawPriority = document.getElementById("task-priority").value.trim().toLowerCase();
    const priority = ["low", "medium", "high", "urgent"].includes(rawPriority) ? rawPriority : "medium";
    const dueDateVal = document.getElementById("task-due-date").value;
    const due_date = dueDateVal ? new Date(dueDateVal).toISOString() : null;
    const estimated_minutes = parseInt(document.getElementById("task-estimated").value) || 60;

    try {
        const payload = { title, description, priority, status: "todo", estimated_minutes };
        if (due_date) payload.due_date = due_date;

        await api.createTask(payload);
        form.reset();
        document.getElementById("task-priority").value = "medium";
        document.getElementById("task-estimated").value = "60";
        await refresh();
        showToast("Tâche ajoutée avec succès !", "success");
    } catch (error) {
        showToast(error.message || "Création impossible.", "error");
    }
});

list?.addEventListener("click", async (e) => {
    const target = e.target;
    if (!(target instanceof HTMLElement)) return;
    const id = target.dataset.id;
    const action = target.dataset.action;
    if (!id || !action) return;

    try {
        if (action === "delete") { await api.deleteTask(id); showToast("Tâche supprimée.", "success"); }
        if (action === "done") { await api.updateTask(id, { status: "done" }); showToast("Tâche terminée !", "success"); }
        await refresh();
    } catch (error) {
        showToast(error.message || "Action impossible.", "error");
    }
});

refresh().catch((error) => {
    list.innerHTML = `<li>${error.message || "Erreur de chargement des taches."}</li>`;
});
