// events.js - Manejo de Eventos (Top-Down)

import { toggleModal, renderDynamicPatientForm } from './ui.js';
import { createPatientModel } from './patient.js';
import { savePatientsToStorage } from './storage.js';
import { savePatientToCloud } from './syncService.js';

export function bindAppEvents(patientsStore, onSaveSuccess) {
    bindSidebar();
    bindMedicalRecordsEvents(patientsStore, onSaveSuccess);
}

/* --- Listeners Específicos --- */

function bindSidebar() {
    const toggle = () => {
        document.getElementById('sidebar')?.classList.toggle('-translate-x-full');
        document.getElementById('sidebar-overlay')?.classList.toggle('hidden');
    };
    document.getElementById('sidebar-toggle')?.addEventListener('click', toggle);
    document.getElementById('sidebar-overlay')?.addEventListener('click', toggle);
}

function bindMedicalRecordsEvents(patientsStore, onSaveSuccess) {
    document.getElementById('btn-add-record')?.addEventListener('click', () => {
        const modalContainerId = "modalText";
        const emptyModel = createPatientModel();
        
        toggleModal("Registrar Nueva Historia Clínica", "", true);
        renderDynamicPatientForm(modalContainerId, emptyModel);

        const form = document.getElementById('dynamic-patient-form');
        form?.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(form);

            const newPatient = createPatientModel();
            newPatient.id = formData.get('id');
            newPatient.personal_info.first_names = formData.get('first_names');
            newPatient.personal_info.last_names = formData.get('last_names');
            newPatient.personal_info.birth_date = formData.get('birth_date');

            const diagnoses = formData.get('active_diagnoses');
            const treatments = formData.get('current_treatment');

            if (diagnoses) {
                newPatient.current_status.active_diagnoses = diagnoses.split(',').map(s => s.trim());
            }
            if (treatments) {
                newPatient.current_status.current_treatment = treatments.split(',').map(s => s.trim());
            }

            // 1. Agregar al arreglo en memoria
            patientsStore.push(newPatient);

            // 2. Persistir en el disco local (localStorage)
            savePatientsToStorage(patientsStore);

            // 3. Notificar renderizado y cerrar modal
            onSaveSuccess(patientsStore);
            toggleModal('', '', false);
        });

        // Dentro del event listener del formulario (form.addEventListener('submit', ...)):
// Reemplazar la parte donde se agrega al arreglo:

// 1. Guardar en la nube (o marcar como pendiente si está offline)
await savePatientToCloud(newPatient);

// 2. Actualizar almacenamiento local
const existingIndex = patientsStore.findIndex(p => p.id === newPatient.id);
if (existingIndex >= 0) {
    patientsStore[existingIndex] = newPatient;
} else {
    patientsStore.push(newPatient);
}
savePatientsToStorage(patientsStore);

// 3. Renderizar y cerrar modal
onSaveSuccess(patientsStore);
toggleModal('', '', false);

        form?.querySelector('.close-btn')?.addEventListener('click', () => toggleModal('', '', false));
    });
}

