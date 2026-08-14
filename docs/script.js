/*...script.js 
Entrada principal
*/

//IMPORTACIONES

import { getHardware } from './hardware.js';
import { renderRecordsList } from './ui.js';
import { bindAppEvents } from './events.js';
import { loadPatientsFromStorage } from './storage.js';
import { listenForCloudUpdates } from './syncService.js';

//VARIABLES

let BD_SD = loadPatientsFromStorage();

const hardware = document.getElementById("device-tag");

function hardwareTag(){getHardware(text => {if (hardware) hardware.innerText = "Dispositivo: " + text;});}

//FUNCIONES

document.addEventListener('DOMContentLoaded', () => {
    hardwareTag(); //Info de Hardware
    
    // 2. Renderizar historias recuperadas de la memoria local
    renderRecordsList(BD_SD);

    // 3. Vincular eventos
    bindAppEvents(BD_SD, (updatedRecords) => {
        renderRecordsList(updatedRecords);
    });

    // 4. Iniciar escucha en tiempo real de Firebase
    listenForCloudUpdates((cloudRecords) => {
        BD_SD = cloudRecords;
        renderRecordsList(BD_SD);
    });
});