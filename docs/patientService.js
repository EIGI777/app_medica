// services/patientService.js - Procesamiento clínico (De mayor a menor abstracción)

/**
 * Genera la ficha sintética del paciente para la vista rápida
 * @param {Object} patient - Objeto paciente completo
 */
export function getPatientSummary(patient) {
    const age = calculateAge(patient.personal_info.birth_date);
    const primaryContact = getPrimaryContact(patient.personal_info.contacts);
    const currentHospitalDays = calculateHospitalDays(patient.events);

    return {
        header: `Pt. ${patient.personal_info.first_names.split(' ')[0]} ${patient.personal_info.last_names.split(' ')[0]}. CI: ${patient.id} (${age} años)`,
        hospital_days: currentHospitalDays,
        contact_display: primaryContact,
        diagnoses: patient.current_status.active_diagnoses.join(', '),
        treatments: patient.current_status.current_treatment,
        has_steroids: checkActiveMedication(patient.current_status.current_treatment, 'esteroide')
    };
}

/* --- Funciones Auxiliares Específicas (Menor nivel) --- */

/**
 * Calcula la edad en años a partir de la fecha de nacimiento
 */
function calculateAge(birthDate) {
    if (!birthDate) return 0;
    const diff = Date.now() - new Date(birthDate).getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
}

/**
 * Calcula los Días Hospitalización (DH) basados en el último evento de ingreso
 */
function calculateHospitalDays(events) {
    const lastIngress = events.filter(e => e.type === 'ingreso').pop();
    if (!lastIngress) return 0;
    
    const diffHours = (new Date() - new Date(lastIngress.timestamp)) / (1000 * 60 * 60);
    return Math.floor(diffHours / 24);
}

/**
 * Obtiene el contacto principal o muestra el total disponible
 */
function getPrimaryContact(contacts = []) {
    if (!contacts.length) return "Sin contacto";
    return `${contacts[0].number} (${contacts[0].type})${contacts.length > 1 ? ` +${contacts.length - 1}` : ''}`;
}

/**
 * Verifica si el paciente consume cierto grupo de medicamentos actualmente
 */
function checkActiveMedication(treatments = [], keyword) {
    return treatments.some(t => t.toLowerCase().includes(keyword.toLowerCase()));
}