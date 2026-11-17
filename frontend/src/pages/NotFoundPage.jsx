import { Link } from "react-router-dom";

export default function NotFoundPage() {
    return (
        <main className="hub-main">
            <header className="hub-header">
                <div>
                    <h2>Pagină inexistentă (404)</h2>
                    <span className="hub-subtitle">
            Adresa accesată nu corespunde niciunei rute din DeviceVault
          </span>
                </div>
            </header>

            <section className="overview-stage">
                <article className="panel" data-testid="not-found">
                    <h3>404 &mdash; Pagina nu a fost găsită</h3>
                    <p>
                        Linkul pe care ai intrat nu există sau dispozitivul a fost mutat.
                    </p>
                    <Link to="/" className="btn">
                        &larr; Înapoi la dispozitive
                    </Link>
                </article>
            </section>
        </main>
    );
}