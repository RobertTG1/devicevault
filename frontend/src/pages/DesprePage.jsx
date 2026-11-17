import { Link } from "react-router-dom";

export default function DesprePage() {
    return (
        <main className="hub-main">
            <header className="hub-header">
                <div>
                    <h2>Despre DeviceVault</h2>
                    <span className="hub-subtitle">
            Hub Central Smart Home &bull; Arhitectură SPA cu React Router
          </span>
                </div>

                <div className="hub-header-actions">
                    <Link to="/" className="header-pill-btn">
                        &larr; Înapoi la dispozitive
                    </Link>
                </div>
            </header>

            <section className="overview-stage">
                <div className="home-summary-banner">
                    <div className="summary-stat">
                        <span className="s-label">Stack Tehnologic</span>
                        <span className="s-val">React 19 + Vite</span>
                        <span className="s-sub">Single-Page Application</span>
                    </div>
                    <div className="summary-stat">
                        <span className="s-label">Persistență Date</span>
                        <span className="s-val">REST API</span>
                        <span className="s-sub">json-server (:3001)</span>
                    </div>
                    <div className="summary-stat">
                        <span className="s-label">Navigare</span>
                        <span className="s-val">React Router</span>
                        <span className="s-sub">Rute dinamice /devices/:id</span>
                    </div>
                </div>

                <article className="panel">
                    <h3>Ce este DeviceVault?</h3>
                    <p>
                        <strong>DeviceVault</strong> este o aplicație web de tip Smart Home
                        Hub concepută pentru monitorizarea, configurarea și controlul în
                        timp real al dispozitivelor IoT dintr-o locuință inteligentă
                        (aspirator robot cu hartă LiDAR, sistem media 4K cu Ambilight,
                        termostat de centrală termică și espressor automat).
                    </p>
                    <p>
                        Datele dispozitivelor sunt gestionate printr-un API REST local
                        (Operații CRUD complete: citire, adăugare cu validare, comutare
                        stare online/standby și ștergere), iar navigarea între panoul
                        principal, pagina de detaliu a fiecărui dispozitiv și această
                        secțiune se face fără reîncărcarea paginii.
                    </p>
                </article>
            </section>
        </main>
    );
}