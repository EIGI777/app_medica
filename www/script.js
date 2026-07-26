// script.js
import { detectHardwareEnvironment } from './hardware.js';

document.addEventListener('DOMContentLoaded', () => {
    // Detectar hardware y actualizar el DOM
    detectHardwareEnvironment((hardwareText) => {
        const tag = document.getElementById("device-tag");
        if (tag) tag.innerText = "Dispositivo: " + hardwareText;
    });

    // Lógica del Sidebar Móvil
    const toggleBtn = document.getElementById('sidebar-toggle');
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebar-overlay');

    function toggleSidebar() {
        const isOpen = !sidebar.classList.contains('-translate-x-full');
        sidebar.classList.toggle('-translate-x-full', isOpen);
        overlay.classList.toggle('hidden', isOpen);
    }

    toggleBtn?.addEventListener('click', toggleSidebar);
    overlay?.addEventListener('click', toggleSidebar);
});

// Modales
window.openModal = function(moduleName) {
    document.getElementById("modalText").innerHTML = `<strong>${moduleName}</strong><br><br>En un futuro estará disponible, estamos trabajando en ello.`;
    document.getElementById("devModal").style.display = "flex";
};

window.closeModal = function() {
    document.getElementById("devModal").style.display = "none";
};