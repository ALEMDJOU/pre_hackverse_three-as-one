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
            container.innerHTML = '<p style="text-align: center; opacity: 0.6;">Super, vous n\'avez aucune tâche en attente ! 🎉</p>';
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
                <div style="background: rgba(255,255,255,0.05); padding: 16px; border-radius: 12px;">
                    <h3 style="margin-bottom: 12px; color: var(--color-primary);">${day}</h3>
                    <ul style="list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 8px;">
            `;
            
            // Trier les tâches du jour par priorité
            const priorityWeight = { urgent: 4, high: 3, medium: 2, low: 1 };
            groups[day].sort((a, b) => priorityWeight[b.priority] - priorityWeight[a.priority]).forEach(task => {
                html += `
                    <li style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 8px;">
                        <span><strong>${task.title}</strong> <span style="font-size: 0.8em; opacity: 0.7;">(${task.estimated_minutes} min)</span></span>
                        <span class="chip">${task.priority}</span>
                    </li>
                `;
            });

            html += `</ul></div>`;
        });

        if (noDateTasks.length > 0) {
            html += `
                <div style="background: rgba(255,255,255,0.02); padding: 16px; border-radius: 12px; margin-top: 16px;">
                    <h3 style="margin-bottom: 12px; opacity: 0.7;">À planifier (Sans échéance)</h3>
                    <ul style="list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 8px;">
            `;
            noDateTasks.forEach(task => {
                html += `
                    <li style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 8px;">
                        <span><strong>${task.title}</strong></span>
                        <span class="chip">${task.priority}</span>
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
