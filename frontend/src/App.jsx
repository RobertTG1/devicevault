// Datele plasate deasupra functiei conform cerintei etapei
const dispozitive = [
  { id: 1, nume: "Roborock Robot Vacuum", online: true, protocol: "Wi-Fi" },
  { id: 2, nume: "Google TV Streamer", online: false, protocol: "Bluetooth" },
  { id: 3, nume: "Aqara Temperature Sensor", online: true, protocol: "Zigbee" }
];

export default function App() {
  // Calculam dinamic numarul de dispozitive active (online)
  const active = dispozitive.filter((d) => d.online).length;

  return (
      <>
        <header className="app-header">
          <h1>DeviceVault</h1>
          <p>Monitorizează și gestionează dispozitivele Smart Home din locuință.</p>
          <p className="app-count">
            {dispozitive.length} dispozitive, dintre care {active} active
          </p>
        </header>

        <main className="container">
          <section className="panel">
            <h2>Dispozitive conectate</h2>
            {/* Temporar: date brute JSON; componentele apar in Etapa 4 */}
            <pre>{JSON.stringify(dispozitive, null, 2)}</pre>
          </section>
        </main>

        <footer className="app-footer">Proiect Tehnologii Web - 2026-2027</footer>
      </>
  );
}