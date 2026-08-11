// script.js - Entrada principal
import { detectHardwareEnvironment } from './hardware.js';
import { renderRecordsList } from './ui.js';
import { bindAppEvents } from './events.js';
import { loadPatientsFromStorage } from './storage.js';

// Cargar historias guardadas en el dispositivo
const patientsData = loadPatientsFromStorage();

document.addEventListener('DOMContentLoaded', () => {
    // 1. Diagnóstico de hardware
    detectHardwareEnvironment(text => {
        const tag = document.getElementById("device-tag");
        if (tag) tag.innerText = "Dispositivo: " + text;
    });

    // 2. Renderizar historias recuperadas de la memoria local
    renderRecordsList(patientsData);

    // 3. Vincular eventos y guardar cambios
    bindAppEvents(patientsData, (updatedRecords) => {
        renderRecordsList(updatedRecords);
    });
});