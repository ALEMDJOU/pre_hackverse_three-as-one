import { api } from "./api.js";

const container = document.getElementById("planner-container");

function getDayName(dateString) {
    const date = new Date(dateString);
    const days = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
    const dayName = days[date.getDay()];
    const dateNum = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    return `${dayName} ${dateNum}/${month}`;
}

async function loadPlanner() {
    try {
        const tasks = await api.getTasks();
        const pendingTasks = tasks.filter(t => t.status !== "done");

        if (pendingTasks.length === 0) {
            container.innerHTML = '<p style="text-align: center; opacity: 0.6; grid-column: 1 / -1;">Super, vous n\'avez aucune tâche en attente ! 🎉</p>';
            return;
        }

        // Grouper les tâches par date
        const groups = {};
        const noDateTasks = [];

        pendingTasks.forEach(task => {
            if (task.due_date) {
                const day = getDayName(task.due_date);
                if (!groups[day]) groups[day] = [];
                groups[day].push(task);
            } else {
                noDateTasks.push(task);
            }
        });

        // Trier les dates (simple tri alphabétique/temporel pour démo, idéalement par timestamp complet)
        const sortedDays = Object.keys(groups).sort((a, b) => {
            const dateA = new Date(groups[a][0].due_date).getTime();
            const dateB = new Date(groups[b][0].due_date).getTime();
            return dateA - dateB;
        });

        let html = "";

        sortedDays.forEach(day => {
            html += `
                <div class="planner-card animate-card reveal">
                    <h3><span>📅</span> ${day}</h3>
                    <ul class="planner-task-list">
            `;
            
            const priorityWeight = { urgent: 4, high: 3, medium: 2, low: 1 };
            groups[day].sort((a, b) => priorityWeight[b.priority] - priorityWeight[a.priority]).forEach(task => {
                html += `
                    <li class="planner-task-item priority-${task.priority}">
                        <div class="planner-task-header">
                            <span class="planner-task-title">${task.title}</span>
                            <span class="chip">${task.priority}</span>
                        </div>
                        <div class="planner-task-meta">${task.estimated_minutes} min</div>
                    </li>
                `;
            });

            html += `</ul></div>`;
        });

        if (noDateTasks.length > 0) {
            html += `
                <div class="planner-card animate-card reveal" style="border-style: dashed;">
                    <h3><span>💡</span> À planifier</h3>
                    <ul class="planner-task-list">
            `;
            noDateTasks.forEach(task => {
                html += `
                    <li class="planner-task-item priority-${task.priority}">
                         <div class="planner-task-header">
                            <span class="planner-task-title">${task.title}</span>
                            <span class="chip">${task.priority}</span>
                        </div>
                    </li>
                `;
            });
            html += `</ul></div>`;
        }

        container.innerHTML = html;

    } catch (error) {
        container.innerHTML = `<p style="text-align: center; color: #ff5555;">Erreur: ${error.message}</p>`;
    }
}

loadPlanner();
