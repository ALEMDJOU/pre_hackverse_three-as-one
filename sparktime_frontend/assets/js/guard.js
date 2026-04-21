import { isAuthenticated } from "./api.js";

if (!isAuthenticated()) {
    window.location.href = "./auth.html";
}
