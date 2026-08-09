// ui.js - Renderizado y Componentes Dinámicos (Top-Down)

import { getPatientSummary } from './patientService.js';

/**
 * Renderiza la lista de pacientes o el estado vacío
 */
export function renderRecordsList(records = []) {
    const container = document.getElementById('medical-records-list');
    if (!container) return;

    if (!records.length) {
        container.innerHTML = `
            <div class="text-center py-6">
                <div class="text-3xl mb-2 opacity-70">📋</div>
                <p class="text-xs text-slate-400">Sin historias clínicas registradas.</p>
            </div>`;
        return;
    }

    container.innerHTML = records.map(createPatientCardHtml).join('');
}

/**
 * Genera el formulario dinámicamente inspeccionando las llaves del JSON
 */
export function renderDynamicPatientForm(containerId, patientModel) {
    const container = document.getElementById(containerId);
    if (!container) return;

    let formFieldsHtml = `
        <form id="dynamic-patient-form" class="space-y-4 text-left">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                    <label class="block text-xs font-medium text-slate-400 mb-1">Cédula / Identificación</label>
                    <input type="text" name="id" required class="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-slate-100 focus:outline-none focus:border-brand-500" placeholder="Ej. 18234567">
                </div>
                <div>
                    <label class="block text-xs font-medium text-slate-400 mb-1">Nombres</label>
                    <input type="text" name="first_names" required class="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-slate-100 focus:outline-none focus:border-brand-500" placeholder="Juan Carlos">
                </div>
                <div>
                    <label class="block text-xs font-medium text-slate-400 mb-1">Apellidos</label>
                    <input type="text" name="last_names" required class="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-slate-100 focus:outline-none focus:border-brand-500" placeholder="Pérez Gómez">
                </div>
                <div>
                    <label class="block text-xs font-medium text-slate-400 mb-1">Fecha de Nacimiento</label>
                    <input type="date" name="birth_date" required class="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-slate-100 focus:outline-none focus:border-brand-500">
                </div>
            </div>

            <div>
                <label class="block text-xs font-medium text-slate-400 mb-1">Diagnósticos Actuales (separados por coma)</label>
                <input type="text" name="active_diagnoses" class="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-slate-100 focus:outline-none focus:border-brand-500" placeholder="Apendicitis Aguda, HTA">
            </div>

            <div>
                <label class="block text-xs font-medium text-slate-400 mb-1">Tratamiento Actual (separados por coma)</label>
                <input type="text" name="current_treatment" class="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-slate-100 focus:outline-none focus:border-brand-500" placeholder="Dexametasona 4mg EV, Cefalosporina 1g EV">
            </div>

            <div class="flex justify-end gap-2 pt-3 border-t border-slate-700/60">
                <button type="button" class="close-btn px-4 py-2 bg-slate-800 text-slate-300 rounded-lg text-xs font-medium">Cancelar</button>
                <button type="submit" class="px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white rounded-lg text-xs font-bold transition-all">Guardar Historia</button>
            </div>
        </form>
    `;

    container.innerHTML = formFieldsHtml;
}

/** Modales */
export function toggleModal(title = '', contentHtml = '', show = true) {
    const modal = document.getElementById("devModal");
    const modalContent = document.getElementById("modalText");
    if (!modal || !modalContent) return;
    
    if (show) {
        modalContent.innerHTML = `
            <h3 class="text-base font-bold text-slate-100 mb-3">${title}</h3>
            <div>${contentHtml}</div>
        `;
    }
    modal.style.display = show ? "flex" : "none";
}

/* --- Funciones de Menor Nivel (Privadas) --- */

function createPatientCardHtml(patient) {
    const summary = getPatientSummary(patient);
    
    return `
        <div class="p-4 bg-slate-900/80 rounded-xl border border-slate-800 mb-3 text-left shadow-md hover:border-slate-700 transition-colors">
            <div class="flex justify-between items-start mb-2">
                <div>
                    <h4 class="text-sm font-bold text-brand-400">${summary.header}</h4>
                    <p class="text-xs text-slate-400 mt-0.5">DH: <span class="text-slate-200 font-semibold">${summary.hospital_days} días</span> · Contacto: ${summary.contact_display}</p>
                </div>
                ${summary.has_steroids ? '<span class="px-2 py-0.5 text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-full">⚠️ Esteroides</span>' : ''}
            </div>

            <div class="text-xs text-slate-300 space-y-1 mt-2 border-t border-slate-800/80 pt-2">
                <p><strong>DX:</strong> ${summary.diagnoses || 'Sin diagnóstico asignado'}</p>
                <p><strong>Rx:</strong> ${summary.treatments.join(', ') || 'Sin tratamiento activo'}</p>
            </div>
        </div>
    `;
}