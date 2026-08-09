// hardware.js
export function detectHardwareEnvironment(callback) {
    const ua = navigator.userAgent;
    let os = "Desconocido";
    let deviceType = "Escritorio";

    // 1. Sistema Operativo
    if (/CrOS/.test(ua)) os = "ChromeOS";
    else if (/Android/.test(ua)) os = "Android";
    else if (/iPhone|iPad|iPod/.test(ua)) os = "iOS";
    else if (/Win/.test(ua)) os = "Windows";
    else if (/Mac/.test(ua)) os = "macOS";
    else if (/Linux/.test(ua)) os = "Linux";

    // 2. Tipo de Dispositivo
    const isMobile = /Mobi|Android|iPhone/i.test(ua);
    const isTablet = /Tablet|iPad/i.test(ua) || (os === "Android" && !/Mobi/.test(ua));

    if (isTablet) deviceType = "Tablet";
    else if (isMobile) deviceType = "Móvil";

    // 3. Hardware (Cores & RAM)
    const cores = navigator.hardwareConcurrency ? `${navigator.hardwareConcurrency} Cores` : "";
    const ram = navigator.deviceMemory ? `~${navigator.deviceMemory}GB RAM` : "";
    const specs = [cores, ram].filter(Boolean).join(" | ");

    let label = `${os} ${deviceType}` + (specs ? ` · [${specs}]` : "");

    // Devolvemos el resultado básico de inmediato
    callback(label);

    // 4. Intento de modelo exacto (Asíncrono)
    if (navigator.userAgentData?.getHighEntropyValues) {
        navigator.userAgentData.getHighEntropyValues(["model"])
            .then(uaData => {
                if (uaData.model) {
                    callback(`${os} (${uaData.model}) · ${deviceType}`);
                }
            })
            .catch(() => {});
    }
}