import { useState, useEffect } from "react";
import "./App.css";

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
        baterie: 85,
        stare: "Andocat la încărcare",
        modCuratare: "Standard",
        inCuratare: false,
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
        intensitateBoabe: 4, // 1 - 5
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
    // Persistență în localStorage
    const [devices, setDevices] = useState(() => {
        const saved = localStorage.getItem("dv_devices_v2");
        return saved ? JSON.parse(saved) : initialDevices;
    });

    const [routines, setRoutines] = useState(() => {
        const saved = localStorage.getItem("dv_routines_v2");
        return saved ? JSON.parse(saved) : initialRoutines;
    });

    const [darkMode, setDarkMode] = useState(() => {
        return localStorage.getItem("dv_dark_v2") === "true";
    });

    const [activeTab, setActiveTab] = useState("home"); // "home", "room", "rutine"
    const [selectedId, setSelectedId] = useState(2);
    const [cameraSelectata, setCameraSelectata] = useState("Home");
    const [oraCurenta, setOraCurenta] = useState("");
    const [dataCurenta, setDataCurenta] = useState("");
    const [notificare, setNotificare] = useState(null);
    const [diagnosticModal, setDiagnosticModal] = useState(null);
    const [showLogModal, setShowLogModal] = useState(false);

    const [activityLog, setActivityLog] = useState([
        { timp: "12:00:10", text: "Sistemul DeviceVault Hub a pornit (Toate nodurile online)." },
        { timp: "12:05:22", text: "Aqara Sensor: Telemetrie sincronizată pe Zigbee Canal 25." },
        { timp: "12:12:45", text: "Google TV: Sesiune Direct Play 4K inițiată." },
    ]);

    // Salvare automată în localStorage
    useEffect(() => {
        localStorage.setItem("dv_devices_v2", JSON.stringify(devices));
    }, [devices]);

    useEffect(() => {
        localStorage.setItem("dv_routines_v2", JSON.stringify(routines));
    }, [routines]);

    useEffect(() => {
        localStorage.setItem("dv_dark_v2", String(darkMode));
    }, [darkMode]);

    // Adăugare intrare în Jurnalul Live
    const adaugaJurnal = (mesaj) => {
        const acum = new Date().toLocaleTimeString("ro-RO", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
        });
        setActivityLog((prev) => [{ timp: acum, text: mesaj }, ...prev.slice(0, 19)]);
    };

    // Ceas și dată în timp real
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

    // Simulator timp real pentru Roborock
    useEffect(() => {
        const vac = devices.find((d) => d.id === 1);
        if (!vac || !vac.inCuratare || !vac.online) return;

        const interval = setInterval(() => {
            setDevices((prev) =>
                prev.map((d) => {
                    if (d.id === 1 && d.inCuratare && d.online) {
                        return {
                            ...d,
                            durataSecunde: d.durataSecunde + 1,
                            suprafataCuratata: Math.min(95, Number((d.suprafataCuratata + 0.05).toFixed(1))),
                            baterie: Math.max(5, d.baterie - (d.durataSecunde % 20 === 0 ? 1 : 0)),
                        };
                    }
                    return d;
                })
            );
        }, 1000);

        return () => clearInterval(interval);
    }, [devices]);

    // Simulator preparare cafea Jura E8
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

    // Toast Notificare
    const afiseazaNotificare = (mesaj) => {
        setNotificare(mesaj);
        adaugaJurnal(mesaj);
        setTimeout(() => setNotificare(null), 3500);
    };

    // Navigare Camere
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

    // Focus pe un dispozitiv
    const handleSelectDevice = (dev) => {
        setSelectedId(dev.id);
        setCameraSelectata(dev.camera);
        setActiveTab("room");
    };

    // Comutare On/Off cu intrare în jurnal
    const togglePower = (id) => {
        const target = devices.find((d) => d.id === id);
        if (target) {
            const stareNoua = !target.online;
            afiseazaNotificare(`${target.nume}: ${stareNoua ? "PORNIT" : "OPRIT (Standby)"}`);
        }
        setDevices((prev) =>
            prev.map((d) =>
                d.id === id ? { ...d, online: !d.online, inCuratare: false, inPreparare: false } : d
            )
        );
    };

    // Update generic dispozitiv
    const updateDevice = (id, fields, logText = null) => {
        setDevices((prev) =>
            prev.map((d) => (d.id === id ? { ...d, ...fields } : d))
        );
        if (logText) adaugaJurnal(logText);
    };

    // Schimbare sursă Google TV cu metadate dinamice
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

    // Rutine
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
                    if (d.id === 3) return { ...d, online: true };
                    return d;
                })
            );
            afiseazaNotificare("Rutina „Bună Dimineața”: Jura E8 prepară un Espresso intens!");
        } else if (id === "night") {
            setDevices((prev) =>
                prev.map((d) => {
                    if (d.id === 2 || d.id === 4) return { ...d, online: false, redare: false, inPreparare: false };
                    if (d.id === 1)
                        return { ...d, inCuratare: false, stare: "Andocat la încărcare", modCuratare: "Silent" };
                    return d;
                })
            );
            afiseazaNotificare("Rutina „Noapte Bună”: TV & Espressor oprite, Roborock în mod Silent.");
        } else if (id === "movie") {
            const plexMeta = MEDIA_SOURCES["Plex 4K"];
            setDevices((prev) =>
                prev.map((d) => {
                    if (d.id === 2)
                        return {
                            ...d,
                            online: true,
                            redare: true,
                            volum: 55,
                            sursaKey: "Plex 4K",
                            sursa: plexMeta.sursa,
                            badge: plexMeta.badge,
                            titluMedia: plexMeta.titluMedia,
                            codec: plexMeta.codec,
                            themeClass: plexMeta.themeClass,
                        };
                    if (d.id === 1) return { ...d, inCuratare: false, stare: "În pauză la dock" };
                    return d;
                })
            );
            afiseazaNotificare("Rutina „Seară de Film”: Plex 4K pornit, aspiratorul este în pauză.");
        } else if (id === "away") {
            setDevices((prev) =>
                prev.map((d) => {
                    if (d.id === 1)
                        return { ...d, online: true, inCuratare: true, stare: "Curățare în desfășurare...", modCuratare: "Turbo" };
                    if (d.id === 2 || d.id === 4) return { ...d, online: false };
                    return d;
                })
            );
            afiseazaNotificare("Rutina „Curățenie la Plecare”: Roborock aspiră în mod Turbo.");
        }
    };

    // Reset la valorile din fabrică
    const handleResetFactory = () => {
        localStorage.removeItem("dv_devices_v2");
        localStorage.removeItem("dv_routines_v2");
        setDevices(initialDevices);
        setRoutines(initialRoutines);
        afiseazaNotificare("Toate setările au fost readuse la valorile din fabrică.");
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

    // Calcul consum electric estimat în timp real (Watts)
    const consumTotalWatts = devices.reduce((acc, d) => {
        if (!d.online) return acc + 0.5; // Standby
        if (d.tip === "vacuum") return acc + (d.inCuratare ? 55 : 4);
        if (d.tip === "media") return acc + (d.redare ? 18 : 5);
        if (d.tip === "coffee") return acc + (d.inPreparare ? 1450 : 12);
        return acc + 1;
    }, 0);

    return (
        <div className={`hub-viewport ${darkMode ? "dark-theme" : ""}`}>
            <div className="hub-device-frame">
                <div className="hub-notch"></div>

                {/* Notificare Toast */}
                {notificare && <div className="hub-toast">✨ {notificare}</div>}

                <div className="hub-layout">
                    {/* BARA LATERALĂ (SIDEBAR) */}
                    <aside className="hub-sidebar">
                        <div className="hub-clock-block">
                            <div className="hub-clock">{oraCurenta || "12:20"}</div>
                            <div className="hub-date">{dataCurenta || "miercuri, 14 octombrie"}</div>

                            {/* Widget Vreme */}
                            <div className="weather-widget">
                                <div className="weather-main">
                                    <span className="weather-temp">18°C</span>
                                    <span className="weather-icon">🌤️</span>
                                </div>
                                <div className="weather-desc">București &bull; Parțial senin</div>
                                <div className="weather-sub">Umiditate 55% &bull; Vânt 11 km/h</div>
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
                            <button className="reset-factory-btn" onClick={handleResetFactory} title="Resetează datele salvate">
                                🔄 Reset Default
                            </button>
                        </div>
                    </aside>

                    {/* ZONA PRINCIPALĂ */}
                    <main className="hub-main">
                        {/* Header */}
                        <header className="hub-header">
                            <div>
                                <h2>DeviceVault Center</h2>
                                <span className="hub-subtitle">
                  {activeTab === "home" && "Vedere Generală Locuință • Toate camerele"}
                                    {activeTab === "rutine" && "Scenarii & Automatizări Inteligente"}
                                    {activeTab === "room" && (
                                        <>
                                            Zonă: <strong>{cameraSelectata}</strong> &bull; Focalizat:{" "}
                                            <strong>{activeDevice.nume}</strong>
                                        </>
                                    )}
                </span>
                            </div>

                            <div className="hub-header-actions">
                                <button
                                    type="button"
                                    className="header-pill-btn"
                                    onClick={() => setShowLogModal(true)}
                                    title="Deschide Jurnalul de Evenimente"
                                >
                                    📋 Jurnal ({activityLog.length})
                                </button>

                                <button
                                    type="button"
                                    className="header-pill-btn"
                                    onClick={() => setDarkMode(!darkMode)}
                                    title="Comută tema Zi / Noapte"
                                >
                                    {darkMode ? "☀️ Zi" : "🌙 Nocturn"}
                                </button>

                                <div className="hub-status-pill">
                                    <span className="status-indicator-dot"></span>
                                    {activeCount} active din {devices.length}
                                </div>
                            </div>
                        </header>

                        {/* === TAB 1: VEDERE GENERALĂ ACASĂ (OVERVIEW GRID) === */}
                        {activeTab === "home" && (
                            <section className="overview-stage">
                                {/* Banner metrici globale casă */}
                                <div className="home-summary-banner">
                                    <div className="summary-stat">
                                        <span className="s-label">Consum Electric Actual</span>
                                        <span className="s-val">{consumTotalWatts.toFixed(1)} W</span>
                                        <span className="s-sub">Contor inteligent local</span>
                                    </div>
                                    <div className="summary-stat">
                                        <span className="s-label">Climă Interior / Balcon</span>
                                        <span className="s-val">
                      {devices.find((d) => d.id === 3)?.temperatura}°C &bull;{" "}
                                            {devices.find((d) => d.id === 3)?.umiditate}%
                    </span>
                                        <span className="s-sub">Calitate aer optimă</span>
                                    </div>
                                    <div className="summary-stat">
                                        <span className="s-label">Acțiuni Rapide Casă</span>
                                        <div className="quick-global-actions">
                                            <button
                                                className="tiny-action-btn"
                                                onClick={() => {
                                                    setDevices((prev) => prev.map((d) => ({ ...d, online: true })));
                                                    afiseazaNotificare("Toate dispozitivele au fost PORNITE.");
                                                }}
                                            >
                                                ⚡ Pornește Tot
                                            </button>
                                            <button
                                                className="tiny-action-btn danger"
                                                onClick={() => {
                                                    setDevices((prev) =>
                                                        prev.map((d) =>
                                                            d.tip === "climate"
                                                                ? d
                                                                : { ...d, online: false, inCuratare: false, inPreparare: false }
                                                        )
                                                    );
                                                    afiseazaNotificare("Mod Eco activat: consumatorii mari au fost opriți.");
                                                }}
                                            >
                                                🍃 Eco Standby
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Grilă cu toate cele 4 dispozitive */}
                                <div className="overview-devices-grid">
                                    {devices.map((dev) => (
                                        <article
                                            key={dev.id}
                                            className={`overview-card ${!dev.online ? "is-offline" : ""}`}
                                            onClick={() => handleSelectDevice(dev)}
                                        >
                                            <div className="ov-card-top">
                                                <div className="ov-icon-box">{dev.icon}</div>
                                                <button
                                                    className={`power-switch-btn small ${dev.online ? "on" : "off"}`}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        togglePower(dev.id);
                                                    }}
                                                >
                                                    {dev.online ? "PORNIT" : "OPRIT"}
                                                </button>
                                            </div>

                                            <div className="ov-card-mid">
                                                <h4>{dev.nume}</h4>
                                                <span className="ov-room-tag">
                          {dev.camera} &bull; {dev.protocol}
                        </span>
                                            </div>

                                            <div className="ov-card-bottom">
                        <span className="ov-live-info">
                          {!dev.online ? (
                              "În Standby (0.5W)"
                          ) : (
                              <>
                                  {dev.tip === "vacuum" &&
                                      (dev.inCuratare
                                          ? `Aspiră (${dev.suprafataCuratata} m²)`
                                          : `Baterie ${dev.baterie}% • Dock`)}
                                  {dev.tip === "media" && `${dev.sursaKey}: ${dev.titluMedia.slice(0, 22)}...`}
                                  {dev.tip === "climate" && `${dev.temperatura}°C • Umiditate ${dev.umiditate}%`}
                                  {dev.tip === "coffee" &&
                                      (dev.inPreparare
                                          ? `Prepară ${dev.bauturaSelectata}...`
                                          : `Gata • ${dev.bauturaSelectata}`)}
                              </>
                          )}
                        </span>
                                                <span className="ov-open-link">Controlează ➔</span>
                                            </div>
                                        </article>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* === TAB 2: VEDERE RUTINE === */}
                        {activeTab === "rutine" && (
                            <section className="routines-view">
                                <div className="routines-grid">
                                    {routines.map((routine) => (
                                        <article key={routine.id} className="routine-card">
                                            <div className="routine-card-header">
                                                <div className="routine-info">
                                                    <span className="routine-icon">{routine.icon}</span>
                                                    <div>
                                                        <h4>{routine.titlu}</h4>
                                                        <span className="routine-schedule">⏰ {routine.orar}</span>
                                                    </div>
                                                </div>

                                                <button
                                                    type="button"
                                                    className={`round-toggle-btn ${routine.activa ? "active" : ""}`}
                                                    onClick={() => toggleRoutineActive(routine.id)}
                                                >
                                                    <span className="round-toggle-thumb"></span>
                                                </button>
                                            </div>

                                            <p className="routine-desc">{routine.descriere}</p>

                                            <div className="routine-devices-tag">
                                                {routine.dispozitiveAfectate.map((devName) => (
                                                    <span key={devName} className="device-chip">
                            {devName}
                          </span>
                                                ))}
                                            </div>

                                            <div className="routine-footer">
                                                <button className="run-routine-btn" onClick={() => ruleazaRutina(routine.id)}>
                                                    ▶ Rulează acum
                                                </button>
                                            </div>
                                        </article>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* === TAB 3: VEDERE CAMERĂ FOCALIZATĂ (CENTRU + LATERAL) === */}
                        {activeTab === "room" && (
                            <div className="hub-workspace">
                                {/* CARDUL CENTRAL FOCALIZAT */}
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

                                        {/* 1. ECRAN DEDICAT DE STANDBY CÂND DISPOZITIVUL ESTE OPRIT */}
                                        {!activeDevice.online ? (
                                            <div className="device-standby-screen">
                                                <div className="standby-power-circle">⏻</div>
                                                <h4>{activeDevice.nume} este în modul Standby</h4>
                                                <p>
                                                    Dispozitivul este deconectat de la sarcina activă și consumă doar{" "}
                                                    <strong>0.5W</strong> pentru recepția comenzilor din rețeaua locală{" "}
                                                    <strong>{activeDevice.protocol}</strong>.
                                                </p>
                                                <button
                                                    className="action-btn primary standby-wake-btn"
                                                    onClick={() => togglePower(activeDevice.id)}
                                                >
                                                    ⚡ Pornește Dispozitivul Acum
                                                </button>
                                            </div>
                                        ) : (
                                            /* CONTROALE ACTIVE CÂND DISPOZITIVUL ESTE PORNIT */
                                            <div className="center-card-body">
                                                {/* === A. ROBOROCK VACUUM === */}
                                                {activeDevice.tip === "vacuum" && (() => {
                                                    const roomPathD =
                                                        "M 49,160 L 49,95 L 120,95 L 120,55 L 165,55 L 165,150 L 210,150 L 210,60 L 255,60 L 255,150 L 300,150 L 300,60 L 350,60 L 350,140 L 120,150 L 49,160 Z";

                                                    return (
                                                        <div className="control-section">
                                                            <div className="metrics-row">
                                                                <div className="mini-metric">
                                                                    <span className="m-label">Baterie</span>
                                                                    <span className="m-val">{activeDevice.baterie}%</span>
                                                                </div>
                                                                <div className="mini-metric">
                                                                    <span className="m-label">Suprafață</span>
                                                                    <span className="m-val">{activeDevice.suprafataCuratata} m²</span>
                                                                </div>
                                                                <div className="mini-metric">
                                                                    <span className="m-label">Timp Rulare</span>
                                                                    <span className="m-val">{formatSecunde(activeDevice.durataSecunde)}</span>
                                                                </div>
                                                            </div>

                                                            <div className="room-map-viewport">
                                                                <div className="map-badge-overlay">
                                  <span className="map-live-tag">
                                    <span className={`map-live-dot ${activeDevice.inCuratare ? "pulse" : ""}`}></span>
                                      {activeDevice.inCuratare ? "CURĂȚARE ÎN TIMP REAL" : "HARTĂ SALVATĂ • STANDBY"}
                                  </span>
                                                                    <span className="map-room-title">Living (Parchet & Covor)</span>
                                                                </div>

                                                                <svg viewBox="0 0 400 200" className="room-map-svg">
                                                                    <defs>
                                                                        <pattern id="carpetPattern" width="8" height="8" patternUnits="userSpaceOnUse">
                                                                            <path
                                                                                d="M 0 0 L 8 8 M 8 0 L 0 8"
                                                                                fill="none"
                                                                                stroke="rgba(255,255,255,0.08)"
                                                                                strokeWidth="1"
                                                                            />
                                                                        </pattern>
                                                                        <linearGradient id="trailGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                                                                            <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
                                                                            <stop offset="100%" stopColor="#34d399" stopOpacity="0.95" />
                                                                        </linearGradient>
                                                                    </defs>

                                                                    <rect x="15" y="15" width="370" height="170" rx="10" className="map-floor" />
                                                                    <line
                                                                        x1="385"
                                                                        y1="135"
                                                                        x2="385"
                                                                        y2="165"
                                                                        stroke="#38bdf8"
                                                                        strokeWidth="4"
                                                                        strokeLinecap="round"
                                                                    />
                                                                    <text x="362" y="153" className="map-door-text">
                                                                        UȘĂ
                                                                    </text>

                                                                    <rect x="130" y="60" width="140" height="85" rx="6" className="map-carpet" />
                                                                    <rect x="130" y="60" width="140" height="85" rx="6" fill="url(#carpetPattern)" />
                                                                    <text x="180" y="106" className="map-item-label">
                                                                        COVOR
                                                                    </text>

                                                                    <g className="furniture-item">
                                                                        <rect x="35" y="30" width="65" height="50" rx="6" className="furniture-body" />
                                                                        <rect x="35" y="30" width="14" height="50" rx="3" className="furniture-accent" />
                                                                        <text x="50" y="58" className="map-item-label">
                                                                            CANAPEA
                                                                        </text>
                                                                    </g>

                                                                    <g className="furniture-item">
                                                                        <rect x="175" y="30" width="50" height="22" rx="4" className="furniture-body" />
                                                                        <text x="186" y="44" className="map-item-label">
                                                                            MASĂ
                                                                        </text>
                                                                    </g>

                                                                    <g className="furniture-item">
                                                                        <rect x="295" y="30" width="70" height="20" rx="4" className="furniture-body" />
                                                                        <text x="314" y="43" className="map-item-label">
                                                                            TV STAND
                                                                        </text>
                                                                    </g>

                                                                    <g className="dock-station">
                                                                        <rect x="35" y="148" width="28" height="24" rx="4" className="dock-base" />
                                                                        <path
                                                                            d="M 49 154 L 46 160 L 49 160 L 48 165 L 53 159 L 49 159 Z"
                                                                            fill="#fbbf24"
                                                                        />
                                                                        <text x="28" y="183" className="dock-text">
                                                                            DOCK
                                                                        </text>
                                                                    </g>

                                                                    <path
                                                                        d={roomPathD}
                                                                        fill="none"
                                                                        stroke="rgba(56, 189, 248, 0.12)"
                                                                        strokeWidth="2"
                                                                        strokeDasharray="4 4"
                                                                    />

                                                                    <path
                                                                        id="vacuumPath"
                                                                        d={roomPathD}
                                                                        fill="none"
                                                                        stroke="url(#trailGrad)"
                                                                        strokeWidth="5"
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                        pathLength="1000"
                                                                        strokeDasharray="1000"
                                                                        strokeDashoffset={activeDevice.inCuratare ? undefined : "1000"}
                                                                    >
                                                                        {activeDevice.inCuratare && (
                                                                            <animate
                                                                                attributeName="stroke-dashoffset"
                                                                                from="1000"
                                                                                to="0"
                                                                                dur="22s"
                                                                                repeatCount="indefinite"
                                                                            />
                                                                        )}
                                                                    </path>

                                                                    <g
                                                                        className="vacuum-bot-unit"
                                                                        transform={activeDevice.inCuratare ? undefined : "translate(49, 160)"}
                                                                    >
                                                                        {activeDevice.inCuratare && (
                                                                            <animateMotion dur="22s" repeatCount="indefinite" rotate="auto">
                                                                                <mpath href="#vacuumPath" />
                                                                            </animateMotion>
                                                                        )}

                                                                        {activeDevice.inCuratare && (
                                                                            <path d="M 0 0 L 28 -14 A 32 32 0 0 1 28 14 Z" className="lidar-cone" />
                                                                        )}

                                                                        <circle cx="0" cy="0" r="13" className="bot-shell" />
                                                                        <circle cx="0" cy="0" r="10" className="bot-inner-ring" />
                                                                        <path
                                                                            d="M 10 -7 A 13 13 0 0 1 10 7"
                                                                            fill="none"
                                                                            stroke="#38bdf8"
                                                                            strokeWidth="2.5"
                                                                            strokeLinecap="round"
                                                                        />
                                                                        <circle cx="-1" cy="0" r="4.5" className="bot-lidar-turret" />
                                                                        <circle cx="0.5" cy="-1.5" r="1.5" fill="#ef4444" />
                                                                    </g>
                                                                </svg>

                                                                <div className="map-legend">
                                  <span className="legend-chip">
                                    <span className="legend-color color-cleaned"></span> Suprafață Curățată
                                  </span>
                                                                    <span className="legend-chip">
                                    <span className="legend-color color-dock"></span> Stație Dock
                                  </span>
                                                                    <span className="legend-chip">
                                    <span className="legend-color color-furn"></span> Mobilier Ocolit
                                  </span>
                                                                </div>
                                                            </div>

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
                                                                                    stare: !activeDevice.inCuratare
                                                                                        ? "Curățare în desfășurare..."
                                                                                        : "În pauză la dock",
                                                                                },
                                                                                `Roborock: ${!activeDevice.inCuratare ? "Start aspirare" : "Pus în pauză"}`
                                                                            )
                                                                        }
                                                                    >
                                                                        {activeDevice.inCuratare ? "⏸ Pauză Aspirare" : "▶ Start Curățenie"}
                                                                    </button>
                                                                    <button
                                                                        className="action-btn secondary"
                                                                        onClick={() =>
                                                                            updateDevice(
                                                                                activeDevice.id,
                                                                                {
                                                                                    inCuratare: false,
                                                                                    stare: "Andocat la încărcare",
                                                                                },
                                                                                "Roborock: Trimis la stația de încărcare (Dock)"
                                                                            )
                                                                        }
                                                                    >
                                                                        🏠 Trimite la Dock
                                                                    </button>
                                                                </div>
                                                            </div>

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
                                                                                    `Roborock: Mod aspirare schimbat pe ${mod}`
                                                                                )
                                                                            }
                                                                        >
                                                                            {mod}
                                                                        </button>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    );
                                                })()}

                                                {/* === B. GOOGLE TV STREAMER (cu Surse Dinamice) === */}
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
                                                                        updateDevice(
                                                                            activeDevice.id,
                                                                            { redare: !activeDevice.redare },
                                                                            `Google TV: ${!activeDevice.redare ? "Redare pornită" : "Redare în pauză"}`
                                                                        )
                                                                    }
                                                                >
                                                                    {activeDevice.redare ? "⏸ Pauză" : "▶ Redă"}
                                                                </button>
                                                                <button
                                                                    className="media-circle-btn"
                                                                    onClick={() =>
                                                                        updateDevice(activeDevice.id, {
                                                                            progresSecunde: Math.min(
                                                                                activeDevice.durataTotalaSecunde,
                                                                                activeDevice.progresSecunde + 30
                                                                            ),
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
                              <span className="group-title">
                                Ajustare Volum ({activeDevice.mut ? "MUT" : `${activeDevice.volum}%`})
                              </span>
                                                            <div className="volume-slider-box">
                                                                <span>🔈</span>
                                                                <input
                                                                    type="range"
                                                                    min="0"
                                                                    max="100"
                                                                    value={activeDevice.mut ? 0 : activeDevice.volum}
                                                                    onChange={(e) =>
                                                                        updateDevice(activeDevice.id, {
                                                                            volum: Number(e.target.value),
                                                                            mut: false,
                                                                        })
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

                                                {/* === C. AQARA CLIMATE SENSOR === */}
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

                                                        <div className="sparkline-container">
                                                            <div className="sparkline-header">
                                                                <span className="group-title">Istoric Temperatură (Ultimele 12 ore)</span>
                                                                <span className="sparkline-range">Min: 20.4°C &bull; Max: 23.1°C</span>
                                                            </div>
                                                            <div className="sparkline-chart-wrapper">
                                                                <svg viewBox="0 0 300 65" className="sparkline-svg">
                                                                    <defs>
                                                                        <linearGradient id="climateGrad" x1="0" y1="0" x2="0" y2="1">
                                                                            <stop offset="0%" stopColor="#10b981" stopOpacity="0.4" />
                                                                            <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                                                                        </linearGradient>
                                                                    </defs>
                                                                    <polygon
                                                                        fill="url(#climateGrad)"
                                                                        points="0,60 0,45 35,40 70,35 105,30 140,24 175,20 210,14 245,10 280,16 300,16 300,60"
                                                                    />
                                                                    <polyline
                                                                        fill="none"
                                                                        stroke="#10b981"
                                                                        strokeWidth="3"
                                                                        strokeLinecap="round"
                                                                        points="0,45 35,40 70,35 105,30 140,24 175,20 210,14 245,10 280,16 300,16"
                                                                    />
                                                                    <circle cx="300" cy="16" r="4.5" fill="#047857" stroke="#ffffff" strokeWidth="2" />
                                                                </svg>
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

                                                        <div className="control-group">
                                                            <div className="button-cluster">
                                                                <button
                                                                    className="action-btn secondary"
                                                                    onClick={() =>
                                                                        updateDevice(
                                                                            activeDevice.id,
                                                                            {
                                                                                temperatura: Number((activeDevice.temperatura + 0.1).toFixed(1)),
                                                                            },
                                                                            "Aqara Sensor: Recalibrare manuală efectuată"
                                                                        )
                                                                    }
                                                                >
                                                                    🔄 Recalibrează Valori
                                                                </button>
                                                                <button
                                                                    className={`action-btn secondary ${activeDevice.alertaActiva ? "active" : ""}`}
                                                                    onClick={() =>
                                                                        updateDevice(
                                                                            activeDevice.id,
                                                                            {
                                                                                alertaActiva: !activeDevice.alertaActiva,
                                                                            },
                                                                            `Aqara Sensor: Alertă termică ${
                                                                                !activeDevice.alertaActiva ? "activată" : "dezactivată"
                                                                            }`
                                                                        )
                                                                    }
                                                                >
                                                                    🔔 {activeDevice.alertaActiva ? "Dezactivează Alertă" : "Activează Alertă Termică"}
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}

                                                {/* === D. JURA E8 SMART ESPRESSO (Bucătărie) === */}
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
                                                                    <div
                                                                        className="coffee-progress-fill"
                                                                        style={{ width: `${activeDevice.progresPreparare}%` }}
                                                                    ></div>
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
                                                                        className={`mode-btn ${
                                                                            activeDevice.bauturaSelectata === b.nume ? "active" : ""
                                                                        }`}
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

                                                        <div className="control-group">
                              <span className="group-title">
                                Intensitate Aromă ({activeDevice.intensitateBoabe} / 5 boabe) &bull; Volum:{" "}
                                  {activeDevice.volumApaMl} ml
                              </span>
                                                            <div className="volume-slider-box">
                                                                <span>☕</span>
                                                                <input
                                                                    type="range"
                                                                    min="1"
                                                                    max="5"
                                                                    value={activeDevice.intensitateBoabe}
                                                                    onChange={(e) =>
                                                                        updateDevice(activeDevice.id, {
                                                                            intensitateBoabe: Number(e.target.value),
                                                                        })
                                                                    }
                                                                    className="range-input"
                                                                />
                                                                <span>🔥</span>
                                                            </div>
                                                        </div>

                                                        <div className="button-cluster">
                                                            <button
                                                                className={`action-btn primary ${activeDevice.inPreparare ? "active" : ""}`}
                                                                onClick={() =>
                                                                    updateDevice(
                                                                        activeDevice.id,
                                                                        {
                                                                            inPreparare: !activeDevice.inPreparare,
                                                                            progresPreparare: activeDevice.inPreparare ? 0 : 10,
                                                                        },
                                                                        `Jura E8: Pornit preparare ${activeDevice.bauturaSelectata} (${activeDevice.volumApaMl}ml)`
                                                                    )
                                                                }
                                                            >
                                                                {activeDevice.inPreparare
                                                                    ? "⏹ Oprește Extracția"
                                                                    : `▶ Prepară ${activeDevice.bauturaSelectata}`}
                                                            </button>
                                                            <button
                                                                className="action-btn secondary"
                                                                onClick={() => {
                                                                    updateDevice(activeDevice.id, {
                                                                        nivelApa: 100,
                                                                        nivelBoabe: 100,
                                                                        stare: "Rezervor apă & boabe completate + Clătire",
                                                                    });
                                                                    afiseazaNotificare("Jura E8: Rezervor apă și boabe reumplute (100%).");
                                                                }}
                                                            >
                                                                💧 Reumple Apă & Boabe
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </section>

                                {/* COLOANA LATERALĂ CU CELELALTE DISPOZITIVE */}
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
                                                    <span
                                                        className={`side-chip chip-${dev.protocol.toLowerCase().replace(/[^a-z]/g, "")}`}
                                                    >
                            {dev.protocol}
                          </span>
                                                </div>

                                                <div className="side-card-footer">
                          <span className="side-stat">
                            {!dev.online ? (
                                "Oprit (Standby)"
                            ) : (
                                <>
                                    {dev.tip === "vacuum" && `Baterie: ${dev.baterie}%`}
                                    {dev.tip === "media" && `${dev.sursaKey}`}
                                    {dev.tip === "climate" && `${dev.temperatura}°C • ${dev.umiditate}%`}
                                    {dev.tip === "coffee" && `${dev.bauturaSelectata} • ${dev.nivelApa}% apă`}
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

                        {/* BARA DE JOS CU DIAGNOZĂ */}
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
                                            { label: "Putere Semnal (RSSI)", val: "-54 dBm (Excelent)" },
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
                                        titlu: "Zigbee Coordinator Mesh Diagnostics",
                                        icon: "⚡",
                                        detalii: [
                                            { label: "Coordonator", val: "CC2652P Zigbee 3.0 USB" },
                                            { label: "Canal Zigbee", val: "Canal 25 (Fără interferențe)" },
                                            { label: "Noduri Conectate", val: "1 Router • 3 End-Devices" },
                                            { label: "Link Quality Index (LQI)", val: "186 / 255 (Semnal Puternic)" },
                                        ],
                                    })
                                }
                            >
                                <span className="pill-icon">⚡</span>
                                <span>Mesh Zigbee Coordonator Activ ℹ️</span>
                            </div>

                            <div
                                className="shortcut-pill clickable-pill"
                                onClick={() =>
                                    setDiagnosticModal({
                                        titlu: "Consum & Securitate Locală",
                                        icon: "🛡️",
                                        detalii: [
                                            { label: "Arhitectură", val: "100% Local (Fără Cloud Extern)" },
                                            { label: "Putere Instantanee", val: `${consumTotalWatts.toFixed(1)} Watts` },
                                            { label: "Persistență Date", val: "Activă (LocalStorage Sync)" },
                                            { label: "Status Securitate", val: "Toate porturile izolate VLAN" },
                                        ],
                                    })
                                }
                            >
                                <span className="pill-icon">🛡️</span>
                                <span>Consum: {consumTotalWatts.toFixed(0)}W &bull; Local OK ℹ️</span>
                            </div>
                        </footer>
                    </main>
                </div>

                {/* MODAL DIAGNOZĂ REȚEA */}
                {diagnosticModal && (
                    <div className="diagnostic-modal-backdrop" onClick={() => setDiagnosticModal(null)}>
                        <div className="diagnostic-modal" onClick={(e) => e.stopPropagation()}>
                            <div className="diagnostic-modal-header">
                                <div className="modal-title-wrap">
                                    <span className="modal-icon">{diagnosticModal.icon}</span>
                                    <h3>{diagnosticModal.titlu}</h3>
                                </div>
                                <button className="modal-close-btn" onClick={() => setDiagnosticModal(null)}>
                                    ✕
                                </button>
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
                                <button className="action-btn primary" onClick={() => setDiagnosticModal(null)}>
                                    Închide Diagnoza
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* MODAL JURNAL DE ACTIVITATE LIVE */}
                {showLogModal && (
                    <div className="diagnostic-modal-backdrop" onClick={() => setShowLogModal(false)}>
                        <div className="diagnostic-modal" onClick={(e) => e.stopPropagation()}>
                            <div className="diagnostic-modal-header">
                                <div className="modal-title-wrap">
                                    <span className="modal-icon">📋</span>
                                    <h3>Jurnal Live de Evenimente</h3>
                                </div>
                                <button className="modal-close-btn" onClick={() => setShowLogModal(false)}>
                                    ✕
                                </button>
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
                                <button
                                    className="action-btn secondary"
                                    onClick={() => setActivityLog([{ timp: oraCurenta, text: "Jurnalul a fost golit." }])}
                                >
                                    🗑️ Golește Jurnal
                                </button>
                                <button className="action-btn primary" onClick={() => setShowLogModal(false)}>
                                    Închide
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}