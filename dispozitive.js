// ==========================================
// ETAPA 2: Logica pe date (JavaScript)
// Tema: DeviceVault (Smart Home & Gadgets)
// ==========================================

// Pasul 2: Datele de test si valorile permise
const PROTOCOALE = ["Wi-Fi", "Zigbee", "Bluetooth"];

const dispozitive = [
    { id: 1, nume: "Roborock Robot Vacuum", online: true, protocol: "Wi-Fi" },
    { id: 2, nume: "Google TV Streamer", online: false, protocol: "Bluetooth" },
    { id: 3, nume: "Aqara Temperature Sensor", online: true, protocol: "Zigbee" }
];

// Pasul 3: Listarea numelor dispozitivelor
function listeazaNume(lista) {
    return lista.map((d) => d.nume);
}

// Pasul 4: Numararea dispozitivelor active (online)
function numaraActive(lista) {
    return lista.filter((d) => d.online).length;
}

// Pasul 5: Cautarea dupa nume (case-insensitive)
function cautaDupaNume(lista, text) {
    const textCautat = text.toLowerCase();
    return lista.filter((d) => d.nume.toLowerCase().includes(textCautat));
}

// Pasul 6: Generarea urmatorului ID unic cu reduce
function nextId(lista) {
    return lista.reduce((max, d) => Math.max(max, d.id), 0) + 1;
}

// Pasul 6: Adaugarea cu validare (functie imutabila)
function adaugaDispozitiv(lista, nume, protocol = "Wi-Fi") {
    const numeCurat = nume ? nume.trim() : "";

    // 1. Validare nume gol
    if (!numeCurat) {
        console.warn("Eroare validare: Numele dispozitivului nu poate fi gol.");
        return lista;
    }

    // 2. Validare protocol
    if (!PROTOCOALE.includes(protocol)) {
        console.warn(`Eroare validare: Protocol invalid '${protocol}'. Valori permise: ${PROTOCOALE.join(", ")}`);
        return lista;
    }

    // 3. Creare obiect nou
    const dispozitivNou = {
        id: nextId(lista),
        nume: numeCurat,
        online: true,
        protocol: protocol
    };

    // 4. Return array nou fara a modifica lista originala
    return [...lista, dispozitivNou];
}

// Pasul 7: Comutarea starii (online/offline) cu map
function comutaStare(lista, id) {
    return lista.map((d) => (d.id === id ? { ...d, online: !d.online } : d));
}

// Pasul 7: Stergerea unui dispozitiv cu filter
function stergeDispozitiv(lista, id) {
    return lista.filter((d) => d.id !== id);
}

// ==========================================
// Pasul 8: Testele din consola browserului
// ==========================================

console.log("--- Citire ---");
console.log("Dispozitive:", listeazaNume(dispozitive).join(", "));
console.log("Active (Online):", numaraActive(dispozitive));
console.log("Căutare 'sensor':", listeazaNume(cautaDupaNume(dispozitive, "sensor")).join(", "));

console.log("--- Adăugare ---");
let listaCurenta = adaugaDispozitiv(dispozitive, "Hub Smart Living", "Zigbee");
console.log("Lista nouă:", listaCurenta.length, "dispozitive");
console.log("Originalul a rămas cu:", dispozitive.length, "dispozitive"); // Demonstreaza imutabilitatea

console.log("--- Modificare și ștergere ---");
listaCurenta = comutaStare(listaCurenta, 1);
console.log("După comutare stare id 1, active:", numaraActive(listaCurenta));
listaCurenta = stergeDispozitiv(listaCurenta, 3);
console.log("După ștergerea id 3:", listeazaNume(listaCurenta).join(", "));

console.log("--- Validare ---");
adaugaDispozitiv(listaCurenta, "   "); // Nume gol
adaugaDispozitiv(listaCurenta, "Senzor Pro", "Z-Wave"); // Protocol invalid