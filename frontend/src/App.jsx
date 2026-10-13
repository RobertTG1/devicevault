import { useState, useEffect } from "react";

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
        modCuratare: "Standard", // Silent, Standard, Turbo, Max
        inCuratare: false,
        suprafataCuratata: "42 m²",
        durata: "38 min",
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
        sursa: "Plex Media Server (4K HDR)",
        volum: 45,
        mut: false,
        redare: true,
        rezolutie: "3840x2160 @ 60Hz",
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
        icon: "🌡️",
    },
];

export default function App() {
    const [devices, setDevices] = useState(initialDevices);
    const [selectedId, setSelectedId] = useState(2); // Google TV selectat inițial în centru
    const [cameraSelectata, setCameraSelectata] = useState("Home");
    const [oraCurenta, setOraCurenta] = useState("");

    // Ceas digital
    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            setOraCurenta(
                now.toLocaleTimeString("ro-RO", { hour: "2-digit", minute: "2-digit" })
            );
        };
        updateTime();
        const timer = setInterval(updateTime, 1000);
        return () => clearInterval(timer);
    }, []);

    // Comutare stare Online/Offline
    const togglePower = (id) => {
        setDevices((prev) =>
            prev.map((d) => (d.id === id ? { ...d, online: !d.online } : d))
        );
    };

    // Modificare proprietate generică pe dispozitiv
    const updateDevice = (id, fields) => {
        setDevices((prev) =>
            prev.map((d) => (d.id === id ? { ...d, ...fields } : d))
        );
    };

    // Dispozitivul din centru și dispozitivele din lateral
    const activeDevice = devices.find((d) => d.id === selectedId) || devices[0];
    const sideDevices = devices.filter((d) => d.id !== activeDevice.id);

    const activeCount = devices.filter((d) => d.online).length;

    return (
        <div className="hub-viewport">
            <div className="hub-device-frame">
                <div className="hub-notch"></div>

                <div className="hub-layout">
                    {/* Bara laterală stânga */}
                    <aside className="hub-sidebar">
                        <div className="hub-clock">{oraCurenta || "15:20"}</div>

                        <nav className="hub-nav">
                            <button
                                className={`nav-item ${cameraSelectata === "Home" ? "active" : ""}`}
                                onClick={() => setCameraSelectata("Home")}
                            >
                                Acasă
                            </button>
                            <button className="nav-item">Rutine</button>

                            <hr className="nav-divider" />

                            <span className="nav-heading">Camere</span>
                            {["Living", "Dormitor", "Balcon"].map((cam) => (
                                <button
                                    key={cam}
                                    className={`nav-item ${cameraSelectata === cam ? "active" : ""}`}
                                    onClick={() => setCameraSelectata(cam)}
                                >
                                    {cam}
                                </button>
                            ))}
                        </nav>
                    </aside>

                    {/* Zona principală */}
                    <main className="hub-main">
                        <header className="hub-header">
                            <div>
                                <h2>DeviceVault Center</h2>
                                <span className="hub-subtitle">
                  Dispozitiv focalizat: <strong>{activeDevice.nume}</strong>
                </span>
                            </div>
                            <div className="hub-status-pill">
                                <span className="status-indicator-dot"></span>
                                {activeCount} active din {devices.length}
                            </div>
                        </header>

                        {/* Grid dinamic: Centru (Focalizat) + Lateral (Restul) */}
                        <div className="hub-workspace">
                            {/* === CARDUL PRINCIPAL (CENTRUL HUB-ULUI) === */}
                            <section className="hub-center-stage">
                                <div className={`center-card card-${activeDevice.tip} ${!activeDevice.online ? "is-off" : ""}`}>
                                    {/* Antet Card Centru */}
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

                                    {/* CORP COMENZI & CONFIGURARE SPECIFIC FIECĂRUI DISPOZITIV */}
                                    <div className="center-card-body">
                                        {/* 1. COMENZI ROBOROCK */}
                                        {activeDevice.tip === "vacuum" && (
                                            <div className="control-section">
                                                <div className="metrics-row">
                                                    <div className="mini-metric">
                                                        <span className="m-label">Baterie</span>
                                                        <span className="m-val">{activeDevice.baterie}%</span>
                                                    </div>
                                                    <div className="mini-metric">
                                                        <span className="m-label">Suprafață</span>
                                                        <span className="m-val">{activeDevice.suprafataCuratata}</span>
                                                    </div>
                                                    <div className="mini-metric">
                                                        <span className="m-label">Timp Rulare</span>
                                                        <span className="m-val">{activeDevice.durata}</span>
                                                    </div>
                                                </div>

                                                <div className="control-group">
                                                    <span className="group-title">Comenzi Utilizare</span>
                                                    <div className="button-cluster">
                                                        <button
                                                            className={`action-btn primary ${activeDevice.inCuratare ? "active" : ""}`}
                                                            onClick={() =>
                                                                updateDevice(activeDevice.id, {
                                                                    inCuratare: !activeDevice.inCuratare,
                                                                    stare: !activeDevice.inCuratare ? "Curățare în desfășurare..." : "În pauză",
                                                                })
                                                            }
                                                        >
                                                            {activeDevice.inCuratare ? "⏸ Pauză Aspirare" : "▶ Start Curățenie"}
                                                        </button>
                                                        <button
                                                            className="action-btn secondary"
                                                            onClick={() =>
                                                                updateDevice(activeDevice.id, {
                                                                    inCuratare: false,
                                                                    stare: "Andocat la încărcare",
                                                                })
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
                                                                onClick={() => updateDevice(activeDevice.id, { modCuratare: mod })}
                                                            >
                                                                {mod}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* 2. COMENZI GOOGLE TV STREAMER */}
                                        {activeDevice.tip === "media" && (
                                            <div className="control-section">
                                                <div className="media-screen-banner">
                                                    <span className="media-tag">STREAMING ACTIV</span>
                                                    <h4 className="media-title">{activeDevice.sursa}</h4>
                                                    <span className="media-res">{activeDevice.rezolutie}</span>
                                                </div>

                                                <div className="control-group">
                                                    <span className="group-title">Redare & Volum</span>
                                                    <div className="media-playback-bar">
                                                        <button
                                                            className="action-btn primary"
                                                            onClick={() => updateDevice(activeDevice.id, { redare: !activeDevice.redare })}
                                                        >
                                                            {activeDevice.redare ? "⏸ Pauză" : "▶ Continuă"}
                                                        </button>
                                                        <div className="volume-slider-box">
                                                            <span>🔊 {activeDevice.volum}%</span>
                                                            <input
                                                                type="range"
                                                                min="0"
                                                                max="100"
                                                                value={activeDevice.volum}
                                                                onChange={(e) =>
                                                                    updateDevice(activeDevice.id, { volum: Number(e.target.value) })
                                                                }
                                                                className="range-input"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="control-group">
                                                    <span className="group-title">Schimbă Sursa Video</span>
                                                    <div className="mode-selector">
                                                        {["Plex 4K", "YouTube", "Apple TV", "HDMI 2"].map((src) => (
                                                            <button
                                                                key={src}
                                                                className={`mode-btn ${activeDevice.sursa.includes(src) ? "active" : ""}`}
                                                                onClick={() => updateDevice(activeDevice.id, { sursa: `${src} Stream` })}
                                                            >
                                                                {src}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* 3. COMENZI AQARA CLIMATE SENSOR */}
                                        {activeDevice.tip === "climate" && (
                                            <div className="control-section">
                                                <div className="climate-display-cards">
                                                    <div className="climate-big-card">
                                                        <span className="c-label">Temperatură</span>
                                                        <span className="c-value">{activeDevice.temperatura}°C</span>
                                                        <span className="c-status">Ambianță optimă</span>
                                                    </div>
                                                    <div className="climate-big-card">
                                                        <span className="c-label">Umiditate Relativă</span>
                                                        <span className="c-value">{activeDevice.umiditate}%</span>
                                                        <span className="c-status">Normal</span>
                                                    </div>
                                                </div>

                                                <div className="control-group">
                                                    <span className="group-title">Telemetrie & Rețea</span>
                                                    <div className="metrics-row">
                                                        <div className="mini-metric">
                                                            <span className="m-label">Presiune</span>
                                                            <span className="m-val">{activeDevice.presiune}</span>
                                                        </div>
                                                        <div className="mini-metric">
                                                            <span className="m-label">Semnal Zigbee</span>
                                                            <span className="m-val">{activeDevice.calitateSemnal}</span>
                                                        </div>
                                                        <div className="mini-metric">
                                                            <span className="m-label">Prag Alertă</span>
                                                            <span className="m-val">{activeDevice.pragAlerta}°C</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="control-group">
                                                    <span className="group-title">Configurare Senzor</span>
                                                    <div className="button-cluster">
                                                        <button
                                                            className="action-btn secondary"
                                                            onClick={() =>
                                                                updateDevice(activeDevice.id, {
                                                                    temperatura: (activeDevice.temperatura + 0.1).toFixed(1),
                                                                })
                                                            }
                                                        >
                                                            🔄 Calibrează / Actualizează
                                                        </button>
                                                        <button
                                                            className="action-btn secondary"
                                                            onClick={() =>
                                                                updateDevice(activeDevice.id, {
                                                                    alertaActiva: !activeDevice.alertaActiva,
                                                                })
                                                            }
                                                        >
                                                            🔔 {activeDevice.alertaActiva ? "Dezactivează Alertă" : "Activează Alertă Termică"}
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </section>

                            {/* === COLOANA LATERALĂ (DISPOZITIVELE SECUNDARE) === */}
                            <aside className="hub-side-stage">
                                <span className="side-title">Alte Dispozitive (Apasă pentru Focus)</span>
                                <div className="side-cards-list">
                                    {sideDevices.map((dev) => (
                                        <article
                                            key={dev.id}
                                            className={`side-card ${!dev.online ? "offline" : ""}`}
                                            onClick={() => setSelectedId(dev.id)}
                                            title="Mută acest dispozitiv în centrul panoului"
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
                          {dev.tip === "vacuum" && `Baterie: ${dev.baterie}%`}
                            {dev.tip === "media" && (dev.online ? "Streaming" : "Oprit")}
                            {dev.tip === "climate" && `${dev.temperatura}°C • ${dev.umiditate}%`}
                        </span>
                                                <span className="swap-hint">Focalizează ➔</span>
                                            </div>
                                        </article>
                                    ))}
                                </div>
                            </aside>
                        </div>

                        {/* Bara inferioară */}
                        <footer className="hub-bottom-bar">
                            <div className="shortcut-pill">
                                <span className="pill-icon">📡</span>
                                <span>Rețea Wi-Fi 5 GHz OK</span>
                            </div>
                            <div className="shortcut-pill">
                                <span className="pill-icon">⚡</span>
                                <span>Mesh Zigbee Coordonator Activ</span>
                            </div>
                            <div className="shortcut-pill">
                                <span className="pill-icon">🛡️</span>
                                <span>DeviceVault Monitorizare Locală</span>
                            </div>
                        </footer>
                    </main>
                </div>
            </div>
        </div>
    );
}