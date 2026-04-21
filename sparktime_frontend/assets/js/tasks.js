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
        li.innerHTML = `
            <strong>${task.title}</strong> <span class="chip">${task.priority}</span>
            <div>${task.description || ""}</div>
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

    try {
        await api.createTask({ title, description, priority, status: "todo", estimated_minutes: 60 });
        form.reset();
        document.getElementById("task-priority").value = "medium";
        await refresh();
    } catch (error) {
        alert(error.message || "Creation impossible.");
    }
});

list?.addEventListener("click", async (e) => {
    const target = e.target;
    if (!(target instanceof HTMLElement)) return;
    const id = target.dataset.id;
    const action = target.dataset.action;
    if (!id || !action) return;

    try {
        if (action === "delete") await api.deleteTask(id);
        if (action === "done") await api.updateTask(id, { status: "done" });
        await refresh();
    } catch (error) {
        alert(error.message || "Action impossible.");
    }
});

refresh().catch((error) => {
    list.innerHTML = `<li>${error.message || "Erreur de chargement des taches."}</li>`;
});
