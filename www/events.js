// events.js - Eventos e Interacciones (Top-Down)

import { toggleModal, renderRecordsList, renderDynamicPatientForm } from './ui.js';
import { createPatientModel } from './patient.js';

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
    // Abrir Formulario Dinámico al presionar (+)
    document.getElementById('btn-add-record')?.addEventListener('click', () => {
        const modalContainerId = "modalText";
        const emptyModel = createPatientModel();
        
        // 1. Desplegar modal
        toggleModal("Registrar Nueva Historia Clínica", "", true);
        
        // 2. Inyectar formulario en el contenedor del modal
        renderDynamicPatientForm(modalContainerId, emptyModel);

        // 3. Escuchar el submit del formulario dinámico
        const form = document.getElementById('dynamic-patient-form');
        form?.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(form);

            // Mapeo directo de inputs HTML al Objeto JSON Estructurado
            const newPatient = createPatientModel();
            newPatient.id = formData.get('id');
            newPatient.personal_info.first_names = formData.get('first_names');
            newPatient.personal_info.last_names = formData.get('last_names');
            newPatient.personal_info.birth_date = formData.get('birth_date');

            // Procesar campos separados por coma
            const diagnoses = formData.get('active_diagnoses');
            const treatments = formData.get('current_treatment');

            if (diagnoses) {
                newPatient.current_status.active_diagnoses = diagnoses.split(',').map(s => s.trim());
            }
            if (treatments) {
                newPatient.current_status.current_treatment = treatments.split(',').map(s => s.trim());
            }

            // Guardar en la colección global y re-renderizar
            patientsStore.push(newPatient);
            onSaveSuccess(patientsStore);
            toggleModal('', '', false);
        });

        // Escuchar botón cerrar dentro del form
        form?.querySelector('.close-btn')?.addEventListener('click', () => toggleModal('', '', false));
    });
}