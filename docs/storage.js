// storage.js - Gestión de Persistencia Local (Top-Down)

const STORAGE_KEY = 'app_medica_patients_v1';

/**
 * Obtiene la lista de historias clínicas guardadas en el disco local
 * @returns {Array} Lista de pacientes o arreglo vacío
 */
export function loadPatientsFromStorage() {
    try {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    } catch (error) {
        console.error('Error al cargar datos locales:', error);
        return [];
    }
}

/**
 * Guarda la lista completa de historias clínicas en el disco local
 * @param {Array} patientsList - Lista actualizada de pacientes
 */
export function savePatientsToStorage(patientsList = []) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(patientsList));
        return true;
    } catch (error) {
        console.error('Error al guardar datos locales:', error);
        return false;
    }
}

/**
 * Elimina todas las historias clínicas locales (Útil para pruebas/reset)
 */
export function clearPatientsStorage() {
    localStorage.removeItem(STORAGE_KEY);
}