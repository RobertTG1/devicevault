import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { fetchDevice, updateDevice, deleteDevice } from "../api.js";
import DeviceIcon from "../components/DeviceIcon.jsx";

export default function DeviceDetaliuPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [device, setDevice] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [notFound, setNotFound] = useState(false);

    useEffect(() => {
        let ignore = false;
        setLoading(true);
        setError(null);
        setNotFound(false);

        async function load() {
            try {
                const data = await fetchDevice(id);
                if (!ignore) setDevice(data);
            } catch (err) {
                if (!ignore) {
                    if (err.message.includes("404")) {
                        setNotFound(true);
                    } else {
                        setError(err.message);
                    }
                }
            } finally {
                if (!ignore) setLoading(false);
            }
        }

        load();
        return () => {
            ignore = true;
        };
    }, [id]);

    async function handleToggleOnline() {
        if (!device) return;
        try {
            const actualizat = await updateDevice(device.id, {
                online: !device.online,
            });
            setDevice(actualizat);
        } catch (err) {
            setError(err.message);
        }
    }

    async function handleDeleteDevice() {
        if (!device) return;
        try {
            await deleteDevice(device.id);
            navigate("/");
        } catch (err) {
            setError(err.message);
        }
    }

    return (
        <main className="hub-main">
            <header className="hub-header">
                <div>
                    <h2>Detalii Dispozitiv</h2>
                    <span className="hub-subtitle">
            Fișă tehnică &bull; ID nod: <strong>{id}</strong>
          </span>
                </div>

                <div className="hub-header-actions">
                    <Link to="/" className="header-pill-btn" data-testid="detail-back">
                        &larr; Înapoi la dispozitive
                    </Link>
                </div>
            </header>

            <section className="overview-stage">
                {loading && (
                    <p className="info" data-testid="loading">
                        Se încarcă detaliile dispozitivului...
                    </p>
                )}

                {error && (
                    <p className="error" data-testid="error">
                        {error}
                    </p>
                )}

                {notFound && (
                    <article className="panel" data-testid="not-found">
                        <h3>Dispozitivul nu a fost găsit</h3>
                        <p>Nu există niciun dispozitiv înregistrat cu ID-ul „{id}”.</p>
                        <Link to="/" className="btn">
                            Înapoi la lista principală
                        </Link>
                    </article>
                )}

                {device && (
                    <article className="panel" data-testid="detail">
                        <div className="center-card-top">
                            <div className="center-title-box">
                <span className="center-icon">
                  <DeviceIcon type={device.tip} />
                </span>
                                <div>
                                    <h3 data-testid="detail-title">{device.nume}</h3>
                                    <span className="center-location">
                    Cameră: <strong>{device.camera}</strong> &bull; Tip:{" "}
                                        <strong>{device.tip}</strong> &bull; Protocol:{" "}
                                        <strong>{device.protocol || "Wi-Fi"}</strong>
                  </span>
                                </div>
                            </div>

                            <button
                                type="button"
                                className={`power-switch-btn ${device.online ? "on" : "off"}`}
                                onClick={handleToggleOnline}
                            >
                                {device.online ? "PORNIT" : "OPRIT"}
                            </button>
                        </div>

                        <div className="diagnostic-modal-body">
                            <div className="diag-row">
                                <span className="diag-label">Stare curentă</span>
                                <strong className="diag-val">
                                    {device.online ? device.stare || "Activ / Online" : "Standby (Oprit)"}
                                </strong>
                            </div>
                            <div className="diag-row">
                                <span className="diag-label">Zonă / Cameră</span>
                                <strong className="diag-val">{device.camera}</strong>
                            </div>
                            <div className="diag-row">
                                <span className="diag-label">Protocol rețea</span>
                                <strong className="diag-val">{device.protocol || "Wi-Fi 5 GHz"}</strong>
                            </div>

                            {device.baterie !== undefined && (
                                <div className="diag-row">
                                    <span className="diag-label">Nivel baterie</span>
                                    <strong className="diag-val">{device.baterie}%</strong>
                                </div>
                            )}

                            {device.temperatura !== undefined && (
                                <div className="diag-row">
                                    <span className="diag-label">Temperatură măsurată / țintă</span>
                                    <strong className="diag-val">
                                        {device.temperatura}°C (Țintă: {device.temperaturaTinta ?? 23}°C)
                                    </strong>
                                </div>
                            )}

                            {device.titluMedia && (
                                <div className="diag-row">
                                    <span className="diag-label">Conținut media activ</span>
                                    <strong className="diag-val">
                                        {device.sursaKey}: {device.titluMedia}
                                    </strong>
                                </div>
                            )}

                            {device.bauturaSelectata && (
                                <div className="diag-row">
                                    <span className="diag-label">Specialitate selectată</span>
                                    <strong className="diag-val">
                                        {device.bauturaSelectata} ({device.volumApaMl} ml)
                                    </strong>
                                </div>
                            )}
                        </div>

                        <div className="button-cluster" style={{ marginTop: "16px" }}>
                            <button
                                type="button"
                                className="action-btn primary"
                                onClick={handleToggleOnline}
                            >
                                {device.online ? "⏻ Trece în Standby" : "⚡ Pornește Dispozitivul"}
                            </button>

                            <button
                                type="button"
                                className="btn-danger"
                                onClick={handleDeleteDevice}
                            >
                                Șterge dispozitivul
                            </button>
                        </div>
                    </article>
                )}
            </section>
        </main>
    );
}