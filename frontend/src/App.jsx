import { useState, useEffect } from "react";
import "./App.css";

// Coordonate precise în interiorul Living-ului pentru aspirator
const VACUUM_WAYPOINTS = [
    { x: 49, y: 160 }, // Dock
    { x: 49, y: 95 },
    { x: 115, y: 95 },
    { x: 115, y: 55 },
    { x: 165, y: 55 },
    { x: 165, y: 145 },
    { x: 210, y: 145 },
    { x: 210, y: 60 },
    { x: 255, y: 60 },
    { x: 255, y: 145 },
    { x: 300, y: 145 },
    { x: 300, y: 60 },
    { x: 345, y: 60 },
    { x: 345, y: 140 },
    { x: 130, y: 150 },
    { x: 49, y: 160 }, // Înapoi la Dock
];

const MEDIA_SOURCES = {
    "Plex 4K": {
        sursa: "Plex Media Server (4K HDR)",
        badge: "PLEX 4K",
        titluMedia: "Interstellar (2014) • Remux 4K",
        codec: "HEVC Main 10 • Dolby Atmos 7.1",
        durataTotala: 10140,
        progresInitial: 2535,
        themeClass: "theme-plex",
    },
    YouTube: {
        sursa: "YouTube Smart TV App",
        badge: "YOUTUBE 4K",
        titluMedia: "Marques Brownlee • Smart Home Tour 2026",
        codec: "VP9.2 HDR • 2160p @ 60fps • Opus",
        durataTotala: 1420,
        progresInitial: 410,
        themeClass: "theme-youtube",
    },
    "Apple TV": {
        sursa: "Apple TV+ Original Stream",
        badge: "APPLE TV+",
        titluMedia: "Severance — S02E04 • Woe's Hollow",
        codec: "Dolby Vision • Spatial Audio Atmos",
        durataTotala: 3480,
        progresInitial: 1290,
        themeClass: "theme-apple",
    },
    "HDMI 2": {
        sursa: "HDMI 2.1 eARC ( Gaming Input )",
        badge: "HDMI 2.1 VRR",
        titluMedia: "The Witcher 3: Wild Hunt • Next-Gen",
        codec: "RGB 10-Bit • 4K @ 120Hz G-Sync / VRR",
        durataTotala: 7200,
        progresInitial: 3600,
        themeClass: "theme-hdmi",
    },
};

const initialDevices = [
    {
        id: 1,
        nume: "Roborock Robot Vacuum",
        camera: "Living",
        protocol: "Wi-Fi",
        online: true,
        tip: "vacuum",
        baterie: 84,
        stare: "Andocat la încărcare",
        modCuratare: "Standard",
        inCuratare: false,
        seIntoarceLaDock: false,
        laDock: true,
        pasTraseu: 0,
        mopActiv: true,
        debitApa: "Mediu", // Redus, Mediu, Ridicat
        nivelApaMop: 88, // %
        suprafataCuratata: 42,
        durataSecunde: 2280,
        consumWatts: 55,
        icon: "🤖",
    },
    {
        id: 2,
        nume: "Google TV Streamer",
        camera: "Dormitor",
        protocol: "Bluetooth",
        online: true,
        tip: "media",
        stare: "Redare activă",
        sursaKey: "Plex 4K",
        sursa: "Plex Media Server (4K HDR)",
        badge: "PLEX 4K",
        titluMedia: "Interstellar (2014) • Remux 4K",
        codec: "HEVC Main 10 • Dolby Atmos 7.1",
        themeClass: "theme-plex",
        progresSecunde: 2535,
        durataTotalaSecunde: 10140,
        volum: 45,
        mut: false,
        redare: true,
        rezolutie: "3840x2160 @ 60Hz",
        consumWatts: 18,
        icon: "📺",
    },
    {
        id: 3,
        nume: "Aqara Temperature Sensor",
        camera: "Balcon",
        protocol: "Zigbee",
        online: true,
        tip: "climate",
        temperatura: 22.8,
        umiditate: 48,
        presiune: "1014 hPa",
        calitateSemnal: "LQI 186",
        alertaActiva: false,
        pragAlerta: 28.0,
        istoric: [20.4, 20.8, 21.2, 21.6, 22.1, 22.4, 22.9, 23.1, 22.8],
        consumWatts: 1,
        icon: "🌡️",
    },
    {
        id: 4,
        nume: "Jura E8 Smart Espresso",
        camera: "Bucătărie",
        protocol: "Wi-Fi",
        online: true,
        tip: "coffee",
        stare: "Pregătit pentru extracție",
        bauturaSelectata: "Espresso",
        intensitateBoabe: 4,
        volumApaMl: 45,
        nivelApa: 78,
        nivelBoabe: 90,
        temperaturaExtractie: "92°C",
        inPreparare: false,
        progresPreparare: 0,
        cafeleAzi: 3,
        consumWatts: 1450,
        icon: "☕",
    },
];

const initialRoutines = [
    {
        id: "morning",
        titlu: "Bună Dimineața",
        icon: "☀️",
        descriere: "Pornește espressorul Jura pentru un Espresso intens și verifică senzorul meteo de pe balcon.",
        orar: "Luni - Vineri la 07:30",
        activa: true,
        dispozitiveAfectate: ["Jura E8 Smart Espresso", "Aqara Temperature Sensor"],
    },
    {
        id: "night",
        titlu: "Noapte Bună",
        icon: "🌙",
        descriere: "Oprește televizorul și espressorul, andochează Roborock în mod Silent și asigură liniștea.",
        orar: "În fiecare seară la 23:00",
        activa: true,
        dispozitiveAfectate: ["Google TV Streamer", "Roborock Robot Vacuum", "Jura E8 Smart Espresso"],
    },
    {
        id: "movie",
        titlu: "Seară de Film (Cinema)",
        icon: "🎬",
        descriere: "Pornește Google TV pe Plex 4K (volum 55%) și pune Roborock în pauză la dock.",
        orar: "Pornire manuală / Trigger",
        activa: true,
        dispozitiveAfectate: ["Google TV Streamer", "Roborock Robot Vacuum"],
    },
    {
        id: "away",
        titlu: "Curățenie la Plecare",
        icon: "🧹",
        descriere: "Activează aspirarea pe mod Turbo în Living și oprește restul consumatorilor mari.",
        orar: "Luni - Vineri la 09:00",
        activa: false,
        dispozitiveAfectate: ["Roborock Robot Vacuum", "Google TV Streamer", "Jura E8 Smart Espresso"],
    },
];

export default function App() {
    const [devices, setDevices] = useState(() => {
        const saved = localStorage.getItem("dv_devices_v3");
        return saved ? JSON.parse(saved) : initialDevices;
    });

    const [routines, setRoutines] = useState(() => {
        const saved = localStorage.getItem("dv_routines_v3");
        return saved ? JSON.parse(saved) : initialRoutines;
    });

    const [darkMode, setDarkMode] = useState(() => {
        return localStorage.getItem("dv_dark_v3") === "true";
    });

    const [activeTab, setActiveTab] = useState("room");
    const [selectedId, setSelectedId] = useState(1);
    const [cameraSelectata, setCameraSelectata] = useState("Living");
    const [oraCurenta, setOraCurenta] = useState("");
    const [dataCurenta, setDataCurenta] = useState("");
    const [notificare, setNotificare] = useState(null);
    const [diagnosticModal, setDiagnosticModal] = useState(null);
    const [showLogModal, setShowLogModal] = useState(false);

    const [activityLog, setActivityLog] = useState([
        { timp: "12:00:10", text: "Sistemul DeviceVault Hub a pornit (Toate nodurile online)." },
        { timp: "12:05:22", text: "Aqara Sensor: Telemetrie sincronizată pe Zigbee Canal 25." },
        { timp: "12:12:45", text: "Roborock: Stație de andocare verificată, baterie 84%." },
    ]);

    useEffect(() => {
        localStorage.setItem("dv_devices_v3", JSON.stringify(devices));
    }, [devices]);

    useEffect(() => {
        localStorage.setItem("dv_routines_v3", JSON.stringify(routines));
    }, [routines]);

    useEffect(() => {
        localStorage.setItem("dv_dark_v3", String(darkMode));
    }, [darkMode]);

    const adaugaJurnal = (mesaj) => {
        const acum = new Date().toLocaleTimeString("ro-RO", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
        });
        setActivityLog((prev) => [{ timp: acum, text: mesaj }, ...prev.slice(0, 19)]);
    };

    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            setOraCurenta(now.toLocaleTimeString("ro-RO", { hour: "2-digit", minute: "2-digit" }));
            const optiuniData = { weekday: "long", day: "numeric", month: "long" };
            setDataCurenta(now.toLocaleDateString("ro-RO", optiuniData));
        };
        updateTime();
        const timer = setInterval(updateTime, 1000);
        return () => clearInterval(timer);
    }, []);

    // 1. Simulator Roborock: Deplasare pe hartă în timpul curățeniei
    useEffect(() => {
        const vac = devices.find((d) => d.id === 1);
        if (!vac || !vac.inCuratare || !vac.online) return;

        const interval = setInterval(() => {
            setDevices((prev) =>
                prev.map((d) => {
                    if (d.id === 1 && d.inCuratare && d.online) {
                        const nextPas = (d.pasTraseu + 1) % VACUUM_WAYPOINTS.length;
                        const apaScazuta = d.mopActiv && d.durataSecunde % 20 === 0 ? Math.max(5, d.nivelApaMop - 1) : d.nivelApaMop;
                        const batScazuta = d.durataSecunde % 18 === 0 ? Math.max(5, d.baterie - 1) : d.baterie;

                        return {
                            ...d,
                            pasTraseu: nextPas,
                            durataSecunde: d.durataSecunde + 1,
                            suprafataCuratata: Number((d.suprafataCuratata + 0.08).toFixed(1)),
                            baterie: batScazuta,
                            nivelApaMop: apaScazuta,
                            laDock: false,
                            stare: d.mopActiv ? "Aspirare + Mop în curs..." : "Aspirare în curs...",
                        };
                    }
                    return d;
                })
            );
        }, 1300);

        return () => clearInterval(interval);
    }, [devices]);

    // 2. Simulator Roborock: Revenire vizibilă de unde a rămas către Dock
    useEffect(() => {
        const vac = devices.find((d) => d.id === 1);
        if (!vac || !vac.seIntoarceLaDock || !vac.online) return;

        const interval = setInterval(() => {
            setDevices((prev) =>
                prev.map((d) => {
                    if (d.id === 1 && d.seIntoarceLaDock) {
                        // Dacă a ajuns la Dock (punctul 0)
                        if (d.pasTraseu === 0) {
                            adaugaJurnal("Roborock: A sosit la Dock și a început încărcarea.");
                            return {
                                ...d,
                                seIntoarceLaDock: false,
                                laDock: true,
                                stare: "Andocat la încărcare",
                            };
                        }
                        // Avansează un pas mai aproape de indexul 0
                        const pasNou = d.pasTraseu > 0 ? (d.pasTraseu + 1) % VACUUM_WAYPOINTS.length : 0;
                        return {
                            ...d,
                            pasTraseu: pasNou,
                            stare: "Revenire pe traseu la stația de încărcare...",
                        };
                    }
                    return d;
                })
            );
        }, 1000);

        return () => clearInterval(interval);
    }, [devices]);

    // 3. Simulator Roborock: Încărcare progresivă a bateriei când e la Dock
    useEffect(() => {
        const vac = devices.find((d) => d.id === 1);
        if (!vac || !vac.laDock || vac.baterie >= 100 || !vac.online || vac.inCuratare) return;

        const interval = setInterval(() => {
            setDevices((prev) =>
                prev.map((d) => {
                    if (d.id === 1 && d.laDock && d.baterie < 100) {
                        const nouaBaterie = Math.min(100, d.baterie + 1);
                        if (nouaBaterie === 100) {
                            adaugaJurnal("Roborock: Baterie complet încărcată (100%).");
                        }
                        return {
                            ...d,
                            baterie: nouaBaterie,
                            stare: nouaBaterie === 100 ? "Andocat • Încărcare completă 100%" : `Andocat la încărcare (${nouaBaterie}%)`,
                        };
                    }
                    return d;
                })
            );
        }, 2200); // Crește cu 1% la fiecare 2.2 secunde

        return () => clearInterval(interval);
    }, [devices]);

    // 4. Simulator preparare cafea Jura E8
    useEffect(() => {
        const coffee = devices.find((d) => d.id === 4);
        if (!coffee || !coffee.inPreparare || !coffee.online) return;

        const interval = setInterval(() => {
            setDevices((prev) =>
                prev.map((d) => {
                    if (d.id === 4 && d.inPreparare) {
                        const nouProgres = d.progresPreparare + 10;
                        if (nouProgres >= 100) {
                            return {
                                ...d,
                                inPreparare: false,
                                progresPreparare: 0,
                                stare: `${d.bauturaSelectata} gata de servire!`,
                                cafeleAzi: d.cafeleAzi + 1,
                                nivelApa: Math.max(10, d.nivelApa - 5),
                                nivelBoabe: Math.max(10, d.nivelBoabe - 3),
                            };
                        }
                        return {
                            ...d,
                            progresPreparare: nouProgres,
                            stare: `Extracție ${d.bauturaSelectata} în curs (${nouProgres}%)...`,
                        };
                    }
                    return d;
                })
            );
        }, 600);

        return () => clearInterval(interval);
    }, [devices]);

    const afiseazaNotificare = (mesaj) => {
        setNotificare(mesaj);
        adaugaJurnal(mesaj);
        setTimeout(() => setNotificare(null), 3500);
    };

    const handleSelectCamera = (cam) => {
        if (cam === "Home") {
            setActiveTab("home");
            setCameraSelectata("Home");
            return;
        }
        setActiveTab("room");
        setCameraSelectata(cam);
        const dispozitivCamera = devices.find((d) => d.camera === cam);
        if (dispozitivCamera) setSelectedId(dispozitivCamera.id);
    };

    const handleSelectDevice = (dev) => {
        setSelectedId(dev.id);
        setCameraSelectata(dev.camera);
        setActiveTab("room");
    };

    const togglePower = (id) => {
        const target = devices.find((d) => d.id === id);
        if (target) {
            const stareNoua = !target.online;
            afiseazaNotificare(`${target.nume}: ${stareNoua ? "PORNIT" : "OPRIT (Standby)"}`);
        }
        setDevices((prev) =>
            prev.map((d) =>
                d.id === id
                    ? { ...d, online: !d.online, inCuratare: false, seIntoarceLaDock: false, inPreparare: false }
                    : d
            )
        );
    };

    const updateDevice = (id, fields, logText = null) => {
        setDevices((prev) =>
            prev.map((d) => (d.id === id ? { ...d, ...fields } : d))
        );
        if (logText) adaugaJurnal(logText);
    };

    // Trimiterea robotului la Dock de unde a rămas pe traseu
    const handleSendToDock = () => {
        const vac = devices.find((d) => d.id === 1);
        if (!vac) return;

        if (vac.laDock) {
            afiseazaNotificare("Roborock este deja andocat la stația de încărcare.");
            return;
        }

        updateDevice(
            1,
            {
                inCuratare: false,
                seIntoarceLaDock: true,
                stare: "Se întoarce la stația de încărcare (Dock)...",
            },
            "Roborock: Comandă revenire la dock primită. Întoarcere în curs..."
        );
        afiseazaNotificare("Roborock revine pe traseu către stația de încărcare...");
    };

    const handleChangeMediaSource = (id, srcKey) => {
        const meta = MEDIA_SOURCES[srcKey];
        if (!meta) return;
        updateDevice(
            id,
            {
                sursaKey: srcKey,
                sursa: meta.sursa,
                badge: meta.badge,
                titluMedia: meta.titluMedia,
                codec: meta.codec,
                durataTotalaSecunde: meta.durataTotala,
                progresSecunde: meta.progresInitial,
                themeClass: meta.themeClass,
                redare: true,
            },
            `Google TV: Sursa schimbată pe ${srcKey} (${meta.titluMedia})`
        );
    };

    const toggleRoutineActive = (id) => {
        setRoutines((prev) =>
            prev.map((r) => (r.id === id ? { ...r, activa: !r.activa } : r))
        );
    };

    const ruleazaRutina = (id) => {
        if (id === "morning") {
            setDevices((prev) =>
                prev.map((d) => {
                    if (d.id === 4)
                        return {
                            ...d,
                            online: true,
                            bauturaSelectata: "Espresso",
                            intensitateBoabe: 5,
                            inPreparare: true,
                            progresPreparare: 10,
                        };
                    return d;
                })
            );
            afiseazaNotificare("Rutina „Bună Dimineața”: Jura E8 prepară un Espresso intens!");
        } else if (id === "night") {
            setDevices((prev) =>
                prev.map((d) => {
                    if (d.id === 2 || d.id === 4) return { ...d, online: false, redare: false, inPreparare: false };
                    if (d.id === 1)
                        return { ...d, inCuratare: false, seIntoarceLaDock: true, modCuratare: "Silent" };
                    return d;
                })
            );
            afiseazaNotificare("Rutina „Noapte Bună”: Roborock revine la Dock în mod Silent.");
        }
    };

    const handleResetFactory = () => {
        localStorage.removeItem("dv_devices_v3");
        localStorage.removeItem("dv_routines_v3");
        setDevices(initialDevices);
        setRoutines(initialRoutines);
        afiseazaNotificare("Toate setările au fost readuse la valorile implicite.");
    };

    const formatSecunde = (totalSecunde) => {
        const ore = Math.floor(totalSecunde / 3600);
        const minute = Math.floor((totalSecunde % 3600) / 60);
        const secunde = Math.floor(totalSecunde % 60);
        if (ore > 0) {
            return `${ore}:${minute < 10 ? "0" : ""}${minute}:${secunde < 10 ? "0" : ""}${secunde}`;
        }
        return `${minute}:${secunde < 10 ? "0" : ""}${secunde}`;
    };

    const activeDevice = devices.find((d) => d.id === selectedId) || devices[0];
    const sideDevices = devices.filter((d) => d.id !== activeDevice.id);
    const activeCount = devices.filter((d) => d.online).length;

    const consumTotalWatts = devices.reduce((acc, d) => {
        if (!d.online) return acc + 0.5;
        if (d.tip === "vacuum") return acc + (d.inCuratare ? 55 : (d.laDock ? 15 : 4));
        if (d.tip === "media") return acc + (d.redare ? 18 : 5);
        if (d.tip === "coffee") return acc + (d.inPreparare ? 1450 : 12);
        return acc + 1;
    }, 0);

    // Poziția curentă pe hartă a robotului Roborock
    const robotPos = VACUUM_WAYPOINTS[activeDevice.pasTraseu || 0];
    const dockPos = VACUUM_WAYPOINTS[0];

    // Traseul SVG parcurs până în acest moment
    const trailSlice = VACUUM_WAYPOINTS.slice(0, (activeDevice.pasTraseu || 0) + 1);
    const trailSvgPath = trailSlice.map((p, idx) => `${idx === 0 ? "M" : "L"} ${p.x},${p.y}`).join(" ");

    return (
        <div className={`hub-viewport ${darkMode ? "dark-theme" : ""}`}>
            <div className="hub-device-frame">
                <div className="hub-notch"></div>

                {notificare && <div className="hub-toast">✨ {notificare}</div>}

                <div className="hub-layout">
                    {/* SIDEBAR */}
                    <aside className="hub-sidebar">
                        <div className="hub-clock-block">
                            <div className="hub-clock">{oraCurenta || "13:30"}</div>
                            <div className="hub-date">{dataCurenta || "miercuri, 14 octombrie"}</div>

                            <div className="weather-widget">
                                <div className="weather-main">
                                    <span className="weather-temp">18°C</span>
                                    <span className="weather-icon">🌤️</span>
                                </div>
                                <div className="weather-desc">București &bull; Parțial senin</div>
                            </div>
                        </div>

                        <nav className="hub-nav">
                            <button
                                className={`nav-item ${activeTab === "home" ? "active" : ""}`}
                                onClick={() => handleSelectCamera("Home")}
                            >
                                🏠 Acasă (Overview)
                            </button>
                            <button
                                className={`nav-item ${activeTab === "rutine" ? "active" : ""}`}
                                onClick={() => setActiveTab("rutine")}
                            >
                                ⚡ Rutine ({routines.filter((r) => r.activa).length})
                            </button>

                            <hr className="nav-divider" />

                            <span className="nav-heading">Camere</span>
                            {["Living", "Dormitor", "Bucătărie", "Balcon"].map((cam) => {
                                const devInCam = devices.find((d) => d.camera === cam);
                                return (
                                    <button
                                        key={cam}
                                        className={`nav-item nav-room-btn ${
                                            activeTab === "room" && cameraSelectata === cam ? "active" : ""
                                        }`}
                                        onClick={() => handleSelectCamera(cam)}
                                    >
                                        <span>{cam}</span>
                                        <span className={`room-dot ${devInCam?.online ? "on" : "off"}`}></span>
                                    </button>
                                );
                            })}
                        </nav>

                        <div className="sidebar-footer">
                            <button className="reset-factory-btn" onClick={handleResetFactory}>
                                🔄 Reset Default
                            </button>
                        </div>
                    </aside>

                    {/* MAIN STAGE */}
                    <main className="hub-main">
                        <header className="hub-header">
                            <div>
                                <h2>DeviceVault Center</h2>
                                <span className="hub-subtitle">
                  {activeTab === "home" && "Vedere Generală Locuință • Toate camerele"}
                                    {activeTab === "rutine" && "Scenarii & Automatizări Inteligente"}
                                    {activeTab === "room" && (
                                        <>
                                            Zonă: <strong>{cameraSelectata}</strong> &bull; Focalizat: <strong>{activeDevice.nume}</strong>
                                        </>
                                    )}
                </span>
                            </div>

                            <div className="hub-header-actions">
                                <button type="button" className="header-pill-btn" onClick={() => setShowLogModal(true)}>
                                    📋 Jurnal ({activityLog.length})
                                </button>
                                <button type="button" className="header-pill-btn" onClick={() => setDarkMode(!darkMode)}>
                                    {darkMode ? "☀️ Zi" : "🌙 Nocturn"}
                                </button>
                                <div className="hub-status-pill">
                                    <span className="status-indicator-dot"></span>
                                    {activeCount} active din {devices.length}
                                </div>
                            </div>
                        </header>

                        {/* VEDERE CAMERĂ / CENTRALĂ */}
                        {activeTab === "room" && (
                            <div className="hub-workspace">
                                <section className="hub-center-stage">
                                    <div className={`center-card card-${activeDevice.tip} ${!activeDevice.online ? "is-off" : ""}`}>
                                        <div className="center-card-top">
                                            <div className="center-title-box">
                                                <span className="center-icon">{activeDevice.icon}</span>
                                                <div>
                                                    <h3>{activeDevice.nume}</h3>
                                                    <span className="center-location">
                            {activeDevice.camera} &bull; Protocol: <strong>{activeDevice.protocol}</strong>
                          </span>
                                                </div>
                                            </div>

                                            <button
                                                className={`power-switch-btn ${activeDevice.online ? "on" : "off"}`}
                                                onClick={() => togglePower(activeDevice.id)}
                                            >
                                                {activeDevice.online ? "PORNIT" : "OPRIT"}
                                            </button>
                                        </div>

                                        {!activeDevice.online ? (
                                            <div className="device-standby-screen">
                                                <div className="standby-power-circle">⏻</div>
                                                <h4>{activeDevice.nume} este în modul Standby</h4>
                                                <p>Dispozitivul este în așteptare și consumă doar 0.5W.</p>
                                                <button className="action-btn primary" onClick={() => togglePower(activeDevice.id)}>
                                                    ⚡ Pornește Dispozitivul
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="center-card-body">
                                                {/* ==============================================
                            ROBOROCK VACUUM (Hartă, Mopping, Return & Charge)
                            ============================================== */}
                                                {activeDevice.tip === "vacuum" && (
                                                    <div className="control-section">
                                                        {/* Rândul de metrici cu statusul de încărcare */}
                                                        <div className="metrics-row">
                                                            <div className="mini-metric">
                                                                <span className="m-label">Baterie</span>
                                                                <span className={`m-val ${activeDevice.laDock && activeDevice.baterie < 100 ? "charging-val" : ""}`}>
                                  {activeDevice.baterie}%
                                                                    {activeDevice.laDock && activeDevice.baterie < 100 && (
                                                                        <span className="charging-badge"> ⚡ Încărcare...</span>
                                                                    )}
                                                                    {activeDevice.laDock && activeDevice.baterie === 100 && (
                                                                        <span className="full-badge"> ✓ Plin</span>
                                                                    )}
                                </span>
                                                            </div>
                                                            <div className="mini-metric">
                                                                <span className="m-label">Suprafață Curățată</span>
                                                                <span className="m-val">{activeDevice.suprafataCuratata} m²</span>
                                                            </div>
                                                            <div className="mini-metric">
                                                                <span className="m-label">Timp Rulare</span>
                                                                <span className="m-val">{formatSecunde(activeDevice.durataSecunde)}</span>
                                                            </div>
                                                        </div>

                                                        {/* HARTA 2D CU TRASARE DINAMICĂ ȘI LINIE DE ÎNTOARCERE */}
                                                        <div className="room-map-viewport">
                                                            <div className="map-badge-overlay">
                                <span className="map-live-tag">
                                  <span className={`map-live-dot ${activeDevice.inCuratare ? "pulse" : (activeDevice.seIntoarceLaDock ? "return-pulse" : "")}`}></span>
                                    {activeDevice.inCuratare
                                        ? (activeDevice.mopActiv ? "ASPIRARE + SPĂLARE MOP ACTIVĂ" : "ASPIRARE USCATĂ ÎN CURS")
                                        : (activeDevice.seIntoarceLaDock ? "REVENIRE LA DOCK ÎN CURS" : "ROBOT LA DOCK • ANDOCAT")}
                                </span>
                                                                <span className="map-room-title">Living • {activeDevice.stare}</span>
                                                            </div>

                                                            <svg viewBox="0 0 400 200" className="room-map-svg">
                                                                <defs>
                                                                    <pattern id="carpetPattern" width="8" height="8" patternUnits="userSpaceOnUse">
                                                                        <path d="M 0 0 L 8 8 M 8 0 L 0 8" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1"/>
                                                                    </pattern>
                                                                    {/* Gradient Mop (Umed Acvatic) */}
                                                                    <linearGradient id="mopTrailGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                                                                        <stop offset="0%" stopColor="#0284c7" stopOpacity="0.3" />
                                                                        <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.95" />
                                                                    </linearGradient>
                                                                    {/* Gradient Uscat (Verde clasic) */}
                                                                    <linearGradient id="dryTrailGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                                                                        <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
                                                                        <stop offset="100%" stopColor="#34d399" stopOpacity="0.95" />
                                                                    </linearGradient>
                                                                </defs>

                                                                {/* Podea */}
                                                                <rect x="15" y="15" width="370" height="170" rx="10" className="map-floor" />
                                                                <line x1="385" y1="135" x2="385" y2="165" stroke="#38bdf8" strokeWidth="4" strokeLinecap="round" />
                                                                <text x="362" y="153" className="map-door-text">UȘĂ</text>

                                                                {/* Covor central */}
                                                                <rect x="130" y="60" width="140" height="85" rx="6" className="map-carpet" />
                                                                <rect x="130" y="60" width="140" height="85" rx="6" fill="url(#carpetPattern)" />
                                                                <text x="180" y="106" className="map-item-label">COVOR</text>

                                                                {/* Mobilier */}
                                                                <g className="furniture-item">
                                                                    <rect x="35" y="30" width="65" height="50" rx="6" className="furniture-body" />
                                                                    <rect x="35" y="30" width="14" height="50" rx="3" className="furniture-accent" />
                                                                    <text x="50" y="58" className="map-item-label">CANAPEA</text>
                                                                </g>
                                                                <g className="furniture-item">
                                                                    <rect x="175" y="30" width="50" height="22" rx="4" className="furniture-body" />
                                                                    <text x="186" y="44" className="map-item-label">MASĂ</text>
                                                                </g>
                                                                <g className="furniture-item">
                                                                    <rect x="295" y="30" width="70" height="20" rx="4" className="furniture-body" />
                                                                    <text x="314" y="43" className="map-item-label">TV STAND</text>
                                                                </g>

                                                                {/* Dock de încărcare */}
                                                                <g className="dock-station">
                                                                    <rect x="35" y="148" width="28" height="24" rx="4" className="dock-base" />
                                                                    <path d="M 49 154 L 46 160 L 49 160 L 48 165 L 53 159 L 49 159 Z" fill="#fbbf24" />
                                                                    <text x="28" y="183" className="dock-text">DOCK</text>
                                                                </g>

                                                                {/* Traseul parcurs până acum de robot */}
                                                                {activeDevice.pasTraseu > 0 && (
                                                                    <path
                                                                        d={trailSvgPath}
                                                                        fill="none"
                                                                        stroke={activeDevice.mopActiv ? "url(#mopTrailGrad)" : "url(#dryTrailGrad)"}
                                                                        strokeWidth={activeDevice.mopActiv ? "7" : "5"}
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                        className="dynamic-trail-path"
                                                                    />
                                                                )}

                                                                {/* Linia punctată animată de întoarcere la Dock */}
                                                                {activeDevice.seIntoarceLaDock && (
                                                                    <line
                                                                        x1={robotPos.x}
                                                                        y1={robotPos.y}
                                                                        x2={dockPos.x}
                                                                        y2={dockPos.y}
                                                                        stroke="#f59e0b"
                                                                        strokeWidth="3"
                                                                        strokeDasharray="6 4"
                                                                        className="return-path-line"
                                                                    />
                                                                )}

                                                                {/* Unitatea fizică Roborock deplasată fluid prin CSS Transform */}
                                                                <g
                                                                    className="vacuum-bot-unit"
                                                                    style={{
                                                                        transform: `translate(${robotPos.x}px, ${robotPos.y}px)`,
                                                                        transition: "transform 1.2s cubic-bezier(0.25, 1, 0.5, 1)",
                                                                    }}
                                                                >
                                                                    {/* Fascicul LiDAR dacă este activ */}
                                                                    {(activeDevice.inCuratare || activeDevice.seIntoarceLaDock) && (
                                                                        <path d="M 0 0 L 26 -13 A 30 30 0 0 1 26 13 Z" className="lidar-cone" />
                                                                    )}

                                                                    {/* Corp robot */}
                                                                    <circle cx="0" cy="0" r="13" className="bot-shell" />
                                                                    <circle cx="0" cy="0" r="10" className="bot-inner-ring" />

                                                                    {/* Badge Mop pe robot dacă e activ */}
                                                                    {activeDevice.mopActiv && (
                                                                        <circle cx="-5" cy="5" r="3.5" fill="#0284c7" />
                                                                    )}

                                                                    <circle cx="-1" cy="0" r="4.5" className="bot-lidar-turret" />
                                                                    <circle cx="0.5" cy="-1.5" r="1.5" fill="#ef4444" />
                                                                </g>
                                                            </svg>

                                                            <div className="map-legend">
                                <span className="legend-chip">
                                  <span className={`legend-color ${activeDevice.mopActiv ? "color-mop" : "color-cleaned"}`}></span>
                                    {activeDevice.mopActiv ? "Spălare Umedă Mop" : "Aspirare Uscată"}
                                </span>
                                                                <span className="legend-chip">
                                  <span className="legend-color color-dock"></span> Stație Dock (Încărcare)
                                </span>
                                                                {activeDevice.seIntoarceLaDock && (
                                                                    <span className="legend-chip">
                                    <span className="legend-color color-return"></span> Traseu Întoarcere
                                  </span>
                                                                )}
                                                            </div>
                                                        </div>

                                                        {/* SECȚIUNE MOPPING (SPĂLARE CU APĂ) */}
                                                        <div className="mopping-control-panel">
                                                            <div className="mop-toggle-row">
                                                                <div className="mop-title-wrap">
                                                                    <span className="mop-icon">💧</span>
                                                                    <div>
                                                                        <h5>Funcționalitate Mopping (Spălare Podele)</h5>
                                                                        <span className="mop-sub">Umezește laveta și spală parchetul activ</span>
                                                                    </div>
                                                                </div>
                                                                <button
                                                                    type="button"
                                                                    className={`round-toggle-btn ${activeDevice.mopActiv ? "active" : ""}`}
                                                                    onClick={() =>
                                                                        updateDevice(
                                                                            activeDevice.id,
                                                                            { mopActiv: !activeDevice.mopActiv },
                                                                            `Roborock: Mopping ${!activeDevice.mopActiv ? "ACTIVAT" : "DEZACTIVAT"}`
                                                                        )
                                                                    }
                                                                >
                                                                    <span className="round-toggle-thumb"></span>
                                                                </button>
                                                            </div>

                                                            {/* Dacă mopul e bifat, apar setările de debit și rezervor */}
                                                            {activeDevice.mopActiv && (
                                                                <div className="mop-options-grid">
                                                                    <div className="mop-water-flow">
                                                                        <span className="group-title">Debit Scurgere Apă Lavetă</span>
                                                                        <div className="mode-selector">
                                                                            {[
                                                                                { id: "Redus", icon: "💧" },
                                                                                { id: "Mediu", icon: "💧💧" },
                                                                                { id: "Ridicat", icon: "💧💧💧" },
                                                                            ].map((flow) => (
                                                                                <button
                                                                                    key={flow.id}
                                                                                    className={`mode-btn ${activeDevice.debitApa === flow.id ? "active" : ""}`}
                                                                                    onClick={() =>
                                                                                        updateDevice(
                                                                                            activeDevice.id,
                                                                                            { debitApa: flow.id },
                                                                                            `Roborock: Debit apă mop setat pe ${flow.id}`
                                                                                        )
                                                                                    }
                                                                                >
                                                                                    {flow.id} {flow.icon}
                                                                                </button>
                                                                            ))}
                                                                        </div>
                                                                    </div>

                                                                    <div className="mop-tank-status">
                                                                        <span className="group-title">Rezervor Apă Curată</span>
                                                                        <div className="tank-progress-wrapper">
                                                                            <div className="tank-bar-fill" style={{ width: `${activeDevice.nivelApaMop}%` }}></div>
                                                                        </div>
                                                                        <span className="tank-label-text">
                                      {activeDevice.nivelApaMop}% plin &bull; Apă dedurizată OK
                                    </span>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>

                                                        {/* BUTOANE COMENZI */}
                                                        <div className="control-group">
                                                            <span className="group-title">Comenzi Utilizare</span>
                                                            <div className="button-cluster">
                                                                <button
                                                                    className={`action-btn primary ${activeDevice.inCuratare ? "active" : ""}`}
                                                                    onClick={() =>
                                                                        updateDevice(
                                                                            activeDevice.id,
                                                                            {
                                                                                inCuratare: !activeDevice.inCuratare,
                                                                                seIntoarceLaDock: false,
                                                                                laDock: false,
                                                                                stare: !activeDevice.inCuratare
                                                                                    ? (activeDevice.mopActiv ? "Aspirare + Mop în curs..." : "Aspirare în desfășurare...")
                                                                                    : "În pauză pe traseu",
                                                                            },
                                                                            `Roborock: ${!activeDevice.inCuratare ? "Start Curățenie" : "Pus în pauză"}`
                                                                        )
                                                                    }
                                                                >
                                                                    {activeDevice.inCuratare ? "⏸ Pauză Curățare" : "▶ Start Curățenie"}
                                                                </button>
                                                                <button
                                                                    className={`action-btn secondary ${activeDevice.seIntoarceLaDock ? "active" : ""}`}
                                                                    onClick={handleSendToDock}
                                                                >
                                                                    🏠 {activeDevice.seIntoarceLaDock ? "Revenire în curs..." : "Trimite la Dock"}
                                                                </button>
                                                            </div>
                                                        </div>

                                                        {/* MOD ASPIRARE */}
                                                        <div className="control-group">
                                                            <span className="group-title">Putere de Aspirare</span>
                                                            <div className="mode-selector">
                                                                {["Silent", "Standard", "Turbo", "Max"].map((mod) => (
                                                                    <button
                                                                        key={mod}
                                                                        className={`mode-btn ${activeDevice.modCuratare === mod ? "active" : ""}`}
                                                                        onClick={() =>
                                                                            updateDevice(
                                                                                activeDevice.id,
                                                                                { modCuratare: mod },
                                                                                `Roborock: Putere aspirare setată pe ${mod}`
                                                                            )
                                                                        }
                                                                    >
                                                                        {mod}
                                                                    </button>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}

                                                {/* GOOGLE TV STREAMER */}
                                                {activeDevice.tip === "media" && (
                                                    <div className="control-section">
                                                        <div className={`media-playback-card ${activeDevice.themeClass || "theme-plex"}`}>
                                                            <div className="media-poster-badge">{activeDevice.badge || "PLEX 4K"}</div>
                                                            <div className="media-details">
                                                                <span className="media-source-tag">{activeDevice.sursa}</span>
                                                                <h4 className="media-track-title">{activeDevice.titluMedia}</h4>
                                                                <span className="media-codec-tag">{activeDevice.codec}</span>
                                                            </div>
                                                            <div className="media-timeline-wrapper">
                                                                <div className="timeline-time">
                                                                    <span>{formatSecunde(activeDevice.progresSecunde)}</span>
                                                                    <span>{formatSecunde(activeDevice.durataTotalaSecunde)}</span>
                                                                </div>
                                                                <input
                                                                    type="range"
                                                                    min="0"
                                                                    max={activeDevice.durataTotalaSecunde}
                                                                    value={activeDevice.progresSecunde}
                                                                    onChange={(e) =>
                                                                        updateDevice(activeDevice.id, { progresSecunde: Number(e.target.value) })
                                                                    }
                                                                    className="timeline-slider"
                                                                />
                                                            </div>
                                                            <div className="media-extended-controls">
                                                                <button
                                                                    className="media-circle-btn"
                                                                    onClick={() =>
                                                                        updateDevice(activeDevice.id, {
                                                                            progresSecunde: Math.max(0, activeDevice.progresSecunde - 30),
                                                                        })
                                                                    }
                                                                >
                                                                    ⏪ 30s
                                                                </button>
                                                                <button
                                                                    className="media-play-pill-btn"
                                                                    onClick={() =>
                                                                        updateDevice(activeDevice.id, { redare: !activeDevice.redare })
                                                                    }
                                                                >
                                                                    {activeDevice.redare ? "⏸ Pauză" : "▶ Redă"}
                                                                </button>
                                                                <button
                                                                    className="media-circle-btn"
                                                                    onClick={() =>
                                                                        updateDevice(activeDevice.id, {
                                                                            progresSecunde: Math.min(activeDevice.durataTotalaSecunde, activeDevice.progresSecunde + 30),
                                                                        })
                                                                    }
                                                                >
                                                                    30s ⏩
                                                                </button>
                                                                <button
                                                                    className={`media-circle-btn ${activeDevice.mut ? "active-muted" : ""}`}
                                                                    onClick={() => updateDevice(activeDevice.id, { mut: !activeDevice.mut })}
                                                                >
                                                                    {activeDevice.mut ? "🔇 Mut" : "🔊 Activ"}
                                                                </button>
                                                            </div>
                                                        </div>

                                                        <div className="control-group">
                                                            <span className="group-title">Ajustare Volum ({activeDevice.mut ? "MUT" : `${activeDevice.volum}%`})</span>
                                                            <div className="volume-slider-box">
                                                                <span>🔈</span>
                                                                <input
                                                                    type="range"
                                                                    min="0"
                                                                    max="100"
                                                                    value={activeDevice.mut ? 0 : activeDevice.volum}
                                                                    onChange={(e) =>
                                                                        updateDevice(activeDevice.id, { volum: Number(e.target.value), mut: false })
                                                                    }
                                                                    className="range-input"
                                                                />
                                                                <span>🔊</span>
                                                            </div>
                                                        </div>

                                                        <div className="control-group">
                                                            <span className="group-title">Selectare Sursă Video & Conținut</span>
                                                            <div className="mode-selector">
                                                                {Object.keys(MEDIA_SOURCES).map((srcKey) => (
                                                                    <button
                                                                        key={srcKey}
                                                                        className={`mode-btn ${activeDevice.sursaKey === srcKey ? "active" : ""}`}
                                                                        onClick={() => handleChangeMediaSource(activeDevice.id, srcKey)}
                                                                    >
                                                                        {srcKey}
                                                                    </button>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}

                                                {/* AQARA CLIMATE SENSOR */}
                                                {activeDevice.tip === "climate" && (
                                                    <div className="control-section">
                                                        <div className="climate-display-cards">
                                                            <div className="climate-big-card">
                                                                <span className="c-label">Temperatură Curentă</span>
                                                                <span className="c-value">{activeDevice.temperatura}°C</span>
                                                                <span className="c-status">Ambianță optimă (Confort termic)</span>
                                                            </div>
                                                            <div className="climate-big-card">
                                                                <span className="c-label">Umiditate Relativă</span>
                                                                <span className="c-value">{activeDevice.umiditate}%</span>
                                                                <span className="c-status">Nivel optim (40% - 60%)</span>
                                                            </div>
                                                        </div>
                                                        <div className="control-group">
                                                            <span className="group-title">Telemetrie & Rețea</span>
                                                            <div className="metrics-row">
                                                                <div className="mini-metric">
                                                                    <span className="m-label">Presiune Aer</span>
                                                                    <span className="m-val">{activeDevice.presiune}</span>
                                                                </div>
                                                                <div className="mini-metric">
                                                                    <span className="m-label">Calitate Semnal</span>
                                                                    <span className="m-val">{activeDevice.calitateSemnal}</span>
                                                                </div>
                                                                <div className="mini-metric">
                                                                    <span className="m-label">Prag Notificare</span>
                                                                    <span className="m-val">{activeDevice.pragAlerta}°C</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}

                                                {/* JURA E8 SMART ESPRESSO */}
                                                {activeDevice.tip === "coffee" && (
                                                    <div className="control-section">
                                                        <div className="metrics-row">
                                                            <div className="mini-metric">
                                                                <span className="m-label">Rezervor Apă</span>
                                                                <span className="m-val">{activeDevice.nivelApa}%</span>
                                                            </div>
                                                            <div className="mini-metric">
                                                                <span className="m-label">Boabe Râșniță</span>
                                                                <span className="m-val">{activeDevice.nivelBoabe}%</span>
                                                            </div>
                                                            <div className="mini-metric">
                                                                <span className="m-label">Cafele Azi</span>
                                                                <span className="m-val">{activeDevice.cafeleAzi} cești</span>
                                                            </div>
                                                        </div>
                                                        <div className="coffee-status-banner">
                                                            <div className="coffee-banner-top">
                                                                <div>
                                                                    <span className="coffee-tag">JURA P.E.P.® EXTRACTION</span>
                                                                    <h4>{activeDevice.bauturaSelectata} • {activeDevice.volumApaMl} ml</h4>
                                                                    <span className="coffee-sub">{activeDevice.stare}</span>
                                                                </div>
                                                                <div className="coffee-beans-Row">
                                                                    {"🫘".repeat(activeDevice.intensitateBoabe)}
                                                                </div>
                                                            </div>
                                                            {activeDevice.inPreparare && (
                                                                <div className="coffee-progress-track">
                                                                    <div className="coffee-progress-fill" style={{ width: `${activeDevice.progresPreparare}%` }}></div>
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="control-group">
                                                            <span className="group-title">Selectează Specialitatea</span>
                                                            <div className="mode-selector">
                                                                {[
                                                                    { nume: "Ristretto", ml: 25 },
                                                                    { nume: "Espresso", ml: 45 },
                                                                    { nume: "Cappuccino", ml: 150 },
                                                                    { nume: "Flat White", ml: 140 },
                                                                ].map((b) => (
                                                                    <button
                                                                        key={b.nume}
                                                                        className={`mode-btn ${activeDevice.bauturaSelectata === b.nume ? "active" : ""}`}
                                                                        onClick={() =>
                                                                            updateDevice(activeDevice.id, {
                                                                                bauturaSelectata: b.nume,
                                                                                volumApaMl: b.ml,
                                                                                stare: `Pregătit pentru ${b.nume}`,
                                                                            })
                                                                        }
                                                                    >
                                                                        {b.nume}
                                                                    </button>
                                                                ))}
                                                            </div>
                                                        </div>
                                                        <div className="button-cluster">
                                                            <button
                                                                className={`action-btn primary ${activeDevice.inPreparare ? "active" : ""}`}
                                                                onClick={() =>
                                                                    updateDevice(activeDevice.id, {
                                                                        inPreparare: !activeDevice.inPreparare,
                                                                        progresPreparare: activeDevice.inPreparare ? 0 : 10,
                                                                    })
                                                                }
                                                            >
                                                                {activeDevice.inPreparare ? "⏹ Oprește Extracția" : `▶ Prepară ${activeDevice.bauturaSelectata}`}
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </section>

                                {/* COLOANA DREAPTA (DISPOZITIVE SECUNDARE) */}
                                <aside className="hub-side-stage">
                                    <span className="side-title">Alte Dispozitive (Apasă pentru Focus)</span>
                                    <div className="side-cards-list">
                                        {sideDevices.map((dev) => (
                                            <article
                                                key={dev.id}
                                                className={`side-card ${!dev.online ? "offline" : ""}`}
                                                onClick={() => handleSelectDevice(dev)}
                                            >
                                                <div className="side-card-header">
                                                    <div className="side-card-info">
                                                        <span className="side-card-icon">{dev.icon}</span>
                                                        <div>
                                                            <h5>{dev.nume}</h5>
                                                            <span className="side-card-room">{dev.camera}</span>
                                                        </div>
                                                    </div>
                                                    <span className={`side-chip chip-${dev.protocol.toLowerCase().replace(/[^a-z]/g, "")}`}>
                            {dev.protocol}
                          </span>
                                                </div>
                                                <div className="side-card-footer">
                          <span className="side-stat">
                            {!dev.online ? "Oprit" : (
                                <>
                                    {dev.tip === "vacuum" && `Baterie: ${dev.baterie}%`}
                                    {dev.tip === "media" && `${dev.sursaKey}`}
                                    {dev.tip === "climate" && `${dev.temperatura}°C`}
                                    {dev.tip === "coffee" && `${dev.bauturaSelectata}`}
                                </>
                            )}
                          </span>
                                                    <span className="swap-hint">Focalizează ➔</span>
                                                </div>
                                            </article>
                                        ))}
                                    </div>
                                </aside>
                            </div>
                        )}

                        {/* BARA DE JOS */}
                        <footer className="hub-bottom-bar">
                            <div
                                className="shortcut-pill clickable-pill"
                                onClick={() =>
                                    setDiagnosticModal({
                                        titlu: "Wi-Fi Hub Diagnostics",
                                        icon: "📡",
                                        detalii: [
                                            { label: "SSID", val: "DeviceVault-IoT-5G" },
                                            { label: "Canal & Bandă", val: "Canal 36 (80 MHz) • 5 GHz" },
                                            { label: "IP Alocat Hub", val: "192.168.1.145 (Static)" },
                                            { label: "Latență Gateway", val: "3 ms" },
                                        ],
                                    })
                                }
                            >
                                <span className="pill-icon">📡</span>
                                <span>Rețea Wi-Fi 5 GHz OK ℹ️</span>
                            </div>

                            <div
                                className="shortcut-pill clickable-pill"
                                onClick={() =>
                                    setDiagnosticModal({
                                        titlu: "Roborock Status & Mop Diagnostics",
                                        icon: "🤖",
                                        detalii: [
                                            { label: "Status Baterie", val: `${devices[0].baterie}% (${devices[0].laDock ? "La încărcător" : "Pe traseu"})` },
                                            { label: "Mod Mopping", val: devices[0].mopActiv ? `Activ (${devices[0].debitApa})` : "Dezactivat" },
                                            { label: "Nivel Rezervor Apă", val: `${devices[0].nivelApaMop}%` },
                                            { label: "Filtru HEPA & Perii", val: "100% Curate" },
                                        ],
                                    })
                                }
                            >
                                <span className="pill-icon">💧</span>
                                <span>Mop: {devices[0].mopActiv ? `Activ (${devices[0].debitApa})` : "Oprit"} ℹ️</span>
                            </div>

                            <div className="shortcut-pill">
                                <span className="pill-icon">⚡</span>
                                <span>Consum Hub: {consumTotalWatts.toFixed(0)} W</span>
                            </div>
                        </footer>
                    </main>
                </div>

                {/* MODAL DIAGNOZĂ */}
                {diagnosticModal && (
                    <div className="diagnostic-modal-backdrop" onClick={() => setDiagnosticModal(null)}>
                        <div className="diagnostic-modal" onClick={(e) => e.stopPropagation()}>
                            <div className="diagnostic-modal-header">
                                <div className="modal-title-wrap">
                                    <span className="modal-icon">{diagnosticModal.icon}</span>
                                    <h3>{diagnosticModal.titlu}</h3>
                                </div>
                                <button className="modal-close-btn" onClick={() => setDiagnosticModal(null)}>✕</button>
                            </div>
                            <div className="diagnostic-modal-body">
                                {diagnosticModal.detalii.map((item, idx) => (
                                    <div key={idx} className="diag-row">
                                        <span className="diag-label">{item.label}</span>
                                        <strong className="diag-val">{item.val}</strong>
                                    </div>
                                ))}
                            </div>
                            <div className="diagnostic-modal-footer">
                                <button className="action-btn primary" onClick={() => setDiagnosticModal(null)}>Închide</button>
                            </div>
                        </div>
                    </div>
                )}

                {/* MODAL JURNAL */}
                {showLogModal && (
                    <div className="diagnostic-modal-backdrop" onClick={() => setShowLogModal(false)}>
                        <div className="diagnostic-modal" onClick={(e) => e.stopPropagation()}>
                            <div className="diagnostic-modal-header">
                                <div className="modal-title-wrap">
                                    <span className="modal-icon">📋</span>
                                    <h3>Jurnal Live de Evenimente</h3>
                                </div>
                                <button className="modal-close-btn" onClick={() => setShowLogModal(false)}>✕</button>
                            </div>
                            <div className="activity-log-list">
                                {activityLog.map((item, index) => (
                                    <div key={index} className="log-entry">
                                        <span className="log-time">{item.timp}</span>
                                        <span className="log-msg">{item.text}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="diagnostic-modal-footer">
                                <button className="action-btn primary" onClick={() => setShowLogModal(false)}>Închide</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}