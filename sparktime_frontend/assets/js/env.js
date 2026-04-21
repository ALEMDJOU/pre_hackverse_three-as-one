(async function loadRuntimeEnv() {
    try {
        const response = await fetch("/.env", { cache: "no-store" });
        if (!response.ok) return;

        const text = await response.text();
        const env = {};

        text.split("\n").forEach((line) => {
            const clean = line.trim();
            if (!clean || clean.startsWith("#")) return;
            const separator = clean.indexOf("=");
            if (separator === -1) return;
            const key = clean.slice(0, separator).trim();
            const value = clean.slice(separator + 1).trim();
            env[key] = value;
        });

        window.__APP_ENV__ = {
            ...(window.__APP_ENV__ || {}),
            ...env
        };
    } catch (_) {
        // Ignore env loading failure and keep static fallback.
    }
})();
