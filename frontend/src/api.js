// Toate cererile HTTP stau aici; componentele nu apelează fetch direct.
export const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3001";

// Funcție comună: trimite JSON și aruncă eroare dacă răspunsul nu este 2xx
async function request(path, options = {}) {
    const res = await fetch(`${API_URL}${path}`, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...options.headers,
        },
    });

    if (!res.ok) {
        throw new Error(`Eroare server: ${res.status}`);
    }

    // 204 No Content nu are corp JSON
    return res.status === 204 ? null : res.json();
}

// Citirea listei (GET)
export function fetchDevices() {
    return request("/devices");
}

// Citirea unui singur element (pentru pagina de detaliu din Etapa 8)
export function fetchDevice(id) {
    return request(`/devices/${id}`);
}

// Adăugarea unui dispozitiv nou (POST)
export function createDevice(device) {
    return request("/devices", {
        method: "POST",
        body: JSON.stringify(device),
    });
}

// Modificarea parțială (PATCH)
export function updateDevice(id, changes) {
    return request(`/devices/${id}`, {
        method: "PATCH",
        body: JSON.stringify(changes),
    });
}

// Ștergerea unui dispozitiv (DELETE)
export function deleteDevice(id) {
    return request(`/devices/${id}`, {
        method: "DELETE",
    });
}