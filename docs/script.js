// script.js - Punto de Entrada Principal (Ultra conciso)
import { checkForUpdates } from './updater.js';
import { detectHardwareEnvironment } from './hardware.js';
import { renderRecordsList } from './ui.js';
import { bindAppEvents } from './events.js';

// Arreglo central temporal con las historias
const patientsData = [];

document.addEventListener('DOMContentLoaded', () => {
    // 1. Detectar hardware
    detectHardwareEnvironment(text => {
        const tag = document.getElementById("device-tag");
        if (tag) tag.innerText = "Dispositivo: " + text;
    });

    // 2. Renderizar lista inicial de historias
    renderRecordsList(patientsData);

    // 3. Vincular eventos e interactividad
    bindAppEvents(patientsData, (updatedRecords) => {
        renderRecordsList(updatedRecords);
    });

    // 4. Verificar actualizaciones silenciosas en segundo plano
    checkForUpdates();
});