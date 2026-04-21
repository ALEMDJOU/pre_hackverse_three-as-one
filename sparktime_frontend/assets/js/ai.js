import { api, isAuthenticated } from "./api.js";

function initAIAssistant() {
    if (!isAuthenticated()) return;

    const container = document.createElement("div");
    container.innerHTML = `
        <div id="ai-chat-window" class="hidden" style="position: fixed; bottom: 85px; right: 20px; width: 340px; height: 500px; background: #fff; border-radius: 16px; box-shadow: 0 10px 40px rgba(0,0,0,0.15); z-index: 1000; border: 1px solid var(--border); display: flex; flex-direction: column; overflow: hidden; font-family: var(--font-family);">
            <div style="background: linear-gradient(135deg, #059669, #10b981); color: white; padding: 14px 18px; font-weight: 600; display: flex; justify-content: space-between; align-items: center;">
                <span>✨ IA Sparktime</span>
                <button id="close-ai" style="background: none; border: none; color: white; font-size: 1.2rem; cursor: pointer; padding: 0;">✕</button>
            </div>
            <div id="ai-messages" style="flex: 1; padding: 16px; overflow-y: auto; display: flex; flex-direction: column; gap: 12px; font-size: 0.9em; background: #fafafa;">
                <div style="background: #e2e8f0; padding: 12px; border-radius: 12px 12px 12px 0; align-self: flex-start; max-width: 85%; color: #1e293b; line-height: 1.4;">
                    Salut ! Comment puis-je vous aider à planifier vos tâches aujourd'hui ?
                </div>
            </div>
            <div style="padding: 12px; background: #fff; border-top: 1px solid var(--border); display: flex; gap: 8px; align-items: center;">
                <input id="ai-input" type="text" placeholder="Posez une question..." style="flex: 1; padding: 10px 14px; border: 1px solid #cbd5e1; border-radius: 20px; outline: none; font-family: var(--font-family);">
                <button id="ai-send" style="background: linear-gradient(135deg, #059669, #10b981); color: white; border: none; width: 38px; height: 38px; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 1.1rem; box-shadow: 0 2px 6px rgba(16,185,129,0.3);">
                ➤</button>
            </div>
        </div>
        <button id="ai-fab" style="position: fixed; bottom: 20px; right: 20px; width: 56px; height: 56px; border-radius: 50%; background: linear-gradient(135deg, #059669, #10b981); color: white; border: none; font-size: 1.5rem; cursor: pointer; box-shadow: 0 4px 15px rgba(16, 185, 129, 0.4); z-index: 999; display: flex; align-items: center; justify-content: center; transition: transform 0.2s;">
            ✨
        </button>
    `;
    document.body.appendChild(container);

    const chatWindow = document.getElementById("ai-chat-window");
    const fabButton = document.getElementById("ai-fab");
    const closeButton = document.getElementById("close-ai");
    const input = document.getElementById("ai-input");
    const sendBtn = document.getElementById("ai-send");
    const msgsContainer = document.getElementById("ai-messages");

    fabButton.addEventListener("click", () => {
        chatWindow.classList.remove("hidden");
        fabButton.style.transform = "scale(0)";
    });
    closeButton.addEventListener("click", () => {
        chatWindow.classList.add("hidden");
        fabButton.style.transform = "scale(1)";
    });

    async function sendMessage() {
        const text = input.value.trim();
        if (!text) return;
        
        // Message utilisateur
        msgsContainer.innerHTML += `<div style="background: var(--primary); color: white; padding: 12px; border-radius: 12px 12px 0 12px; align-self: flex-end; max-width: 85%; line-height: 1.4;">${text}</div>`;
        input.value = "";
        msgsContainer.scrollTop = msgsContainer.scrollHeight;

        try {
            // Typing indicator
            const typingId = "typing-" + Date.now();
            msgsContainer.innerHTML += `<div id="${typingId}" style="background: #e2e8f0; padding: 12px; border-radius: 12px 12px 12px 0; align-self: flex-start; color: #64748b; font-style: italic;">...réflexion en cours...</div>`;
            msgsContainer.scrollTop = msgsContainer.scrollHeight;

            const tasks = await api.getTasks();
            const pending = tasks.filter(t => t.status !== "done");
            let taskContext = "Aucune tâche en attente.";
            if (pending.length > 0) {
                taskContext = pending.map(t => `- [${t.priority.toUpperCase()}] ${t.title} (${t.estimated_minutes} min)`).join("\n");
            }
            
            const prompt = `Voici la liste actuelle de mes devoirs/tâches en attente avec leurs priorités:\n${taskContext}\n\nL'étudiant te dit: "${text}". Réponds directement à la question de manière très brève (maximum 3 phrases) pour l'aider à prioriser ou s'organiser. N'invente pas de tâches.`;

            const res = await api.aiChat(prompt);
            
            const typingMsg = document.getElementById(typingId);
            if(typingMsg) typingMsg.remove();

            const reply = res.reply.replace(/\n/g, '<br>');
            
            msgsContainer.innerHTML += `<div style="background: #e2e8f0; padding: 12px; border-radius: 12px 12px 12px 0; align-self: flex-start; max-width: 85%; color: #1e293b; line-height: 1.4;">${reply}</div>`;
            msgsContainer.scrollTop = msgsContainer.scrollHeight;
        } catch (e) {
            const typingMsg = document.getElementById("typing-" + Date.now());
            if(typingMsg) typingMsg.remove();
            msgsContainer.innerHTML += `<div style="background: #fee2e2; color: #b91c1c; padding: 12px; border-radius: 12px 12px 12px 0; align-self: flex-start; max-width: 85%;">Une erreur est survenue (${e.message || "Erreur"}). Le backend a peut-être besoin de la clé API Qwen.</div>`;
        }
    }

    sendBtn.addEventListener("click", sendMessage);
    input.addEventListener("keypress", (e) => { if(e.key === "Enter") sendMessage(); });
}

// On attend que la session soit vérifiée pour initialiser
setTimeout(initAIAssistant, 500);
