// syncService.js - Motor de Sincronización Nube / Local (Top-Down)

import { db } from './firebase-config.js';
import { collection, onSnapshot, doc, setDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { savePatientsToStorage, loadPatientsFromStorage } from './storage.js';

const PATIENTS_COLLECTION = 'patients';

/**
 * Inicia la escucha en tiempo real de Firestore.
 * Si hay cambios en la nube, actualiza el almacenamiento local y la interfaz.
 */
export function listenForCloudUpdates(onDataUpdated) {
    if (!navigator.onLine) {
        console.log('App sin conexión: escuchando en modo local.');
        return;
    }

    const patientsRef = collection(db, PATIENTS_COLLECTION);

    // Escucha cambios remotos en tiempo real
    onSnapshot(patientsRef, (snapshot) => {
        const cloudPatients = [];
        snapshot.forEach((docSnap) => {
            cloudPatients.push(docSnap.data());
        });

        if (cloudPatients.length > 0) {
            // Unificar con registros locales y guardar
            const merged = mergeLocalAndCloud(loadPatientsFromStorage(), cloudPatients);
            savePatientsToStorage(merged);
            onDataUpdated(merged);
        }
    }, (error) => {
        console.warn('Firestore offline o error de escucha:', error);
    });

    // Escuchar cuando el dispositivo vuelve a tener señal para subir datos pendientes
    window.addEventListener('online', () => {
        syncPendingLocalToCloud();
    });
}

/**
 * Guarda o actualiza un paciente en la nube si hay red, o lo marca pendiente si no la hay.
 */
export async function savePatientToCloud(patient) {
    if (!patient.id) {
        patient.id = 'patient_' + Date.now();
    }

    patient.updated_at = new Date().toISOString();

    if (navigator.onLine) {
        try {
            const patientDocRef = doc(db, PATIENTS_COLLECTION, patient.id);
            await setDoc(patientDocRef, patient, { merge: true });
            patient._pending_sync = false;
        } catch (error) {
            console.error('Error al guardar en la nube, se guardará localmente:', error);
            patient._pending_sync = true;
        }
    } else {
        patient._pending_sync = true;
    }

    return patient;
}

/* --- Funciones Auxiliares de Menor Nivel --- */

/**
 * Sincroniza hacia la nube los registros guardados mientras no había internet
 */
async function syncPendingLocalToCloud() {
    const localPatients = loadPatientsFromStorage();
    const pending = localPatients.filter(p => p._pending_sync === true);

    for (const patient of pending) {
        try {
            const patientDocRef = doc(db, PATIENTS_COLLECTION, patient.id);
            const cleanPatient = { ...patient };
            delete cleanPatient._pending_sync;
            
            await setDoc(patientDocRef, cleanPatient, { merge: true });
            patient._pending_sync = false;
        } catch (err) {
            console.error('Error sincronizando pendiente:', err);
        }
    }
    savePatientsToStorage(localPatients);
}

/**
 * Combina registros locales y remotos resolviendo por fecha de actualización
 */
function mergeLocalAndCloud(localArr, cloudArr) {
    const map = new Map();
    
    localArr.forEach(p => map.set(p.id, p));
    
    cloudArr.forEach(cloudP => {
        const localP = map.get(cloudP.id);
        if (!localP || (cloudP.updated_at && cloudP.updated_at > (localP.updated_at || ''))) {
            map.set(cloudP.id, cloudP);
        }
    });

    return Array.from(map.values());
}