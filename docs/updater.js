// updater.js - Manejador de Actualizaciones OTA (De mayor a menor abstracción)

const REMOTE_MANIFEST_URL = 'https://eigi777.github.io/app_medica/version.json';
const CURRENT_LOCAL_VERSION = '1.0.0'; // Versión base empaquetada en el APK

/**
 * Función principal que inicia la verificación de actualizaciones en segundo plano
 */
export async function checkForUpdates() {
    if (!navigator.onLine) {
        console.log('App en modo offline. Usando archivos locales.');
        return;
    }

    try {
        const remoteManifest = await fetchRemoteVersion();
        
        if (isNewerVersion(remoteManifest.version, CURRENT_LOCAL_VERSION)) {
            console.log(`Nueva versión detectada: ${remoteManifest.version}. Iniciando actualización...`);
            notifyUserUpdateAvailable(remoteManifest);
        }
    } catch (error) {
        console.warn('No se pudo verificar la actualización OTA:', error);
    }
}

/* --- Funciones Auxiliares de Menor Nivel --- */

/**
 * Obtiene el manifiesto de versión desde GitHub Pages
 */
async function fetchRemoteVersion() {
    const response = await fetch(`${REMOTE_MANIFEST_URL}?cache_bust=${Date.now()}`);
    if (!response.ok) throw new Error('Error al obtener manifiesto remoto');
    return await response.json();
}

/**
 * Compara dos cadenas de versión semántica (ej. "1.0.1" > "1.0.0")
 */
function isNewerVersion(remoteVer, localVer) {
    const r = remoteVer.split('.').map(Number);
    const l = localVer.split('.').map(Number);
    
    for (let i = 0; i < Math.max(r.length, l.length); i++) {
        const val1 = r[i] || 0;
        const val2 = l[i] || 0;
        if (val1 > val2) return true;
        if (val1 < val2) return false;
    }
    return false;
}

/**
 * Muestra un aviso sutil en la UI sobre la actualización
 */
function notifyUserUpdateAvailable(manifest) {
    const tag = document.getElementById("device-tag");
    if (tag) {
        tag.innerHTML += ` · <span class="text-emerald-400 font-bold cursor-pointer" id="btn-update-app">🔄 Actualización v${manifest.version} disponible (Toca para recargar)</span>`;
        
        document.getElementById("btn-update-app")?.addEventListener('click', () => {
            window.location.reload(true);
        });
    }
}