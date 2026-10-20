// frontend/src/components/DeviceCard.jsx
// Componentă pentru un singur element din listă, primit prin props

// frontend/src/components/DeviceCard.jsx
// Componentă pentru un singur element din listă, primit prin props

const ETICHETE_PROTOCOL = {
    "Wi-Fi": "Rețea Wi-Fi 5 GHz",
};

export default function DeviceCard({ device, onSelectDevice, onTogglePower, formatSecunde }) {
    const isOnline = device.online;
    const isGoogleTvGlow = device.id === 2 && isOnline && device.redare;

    return (
        <article
            className={`overview-card ${!isOnline ? "is-offline" : ""} ${
                isGoogleTvGlow ? "overview-ambilight-card" : ""
            }`}
            style={isGoogleTvGlow ? { "--card-glow": device.glowColor || "rgba(2, 132, 199, 0.4)" } : {}}
            onClick={() => onSelectDevice(device)}
        >
            <div className="ov-card-top">
                <div className="ov-icon-box">{device.icon}</div>
                <button
                    type="button"
                    className={`power-switch-btn small ${isOnline ? "on" : "off"}`}
                    onClick={(e) => {
                        e.stopPropagation();
                        onTogglePower(device.id);
                    }}
                >
                    {isOnline ? "PORNIT" : "OPRIT"}
                </button>
            </div>

            <div className="ov-card-mid">
                <h4>{device.nume}</h4>
                <span className="ov-room-tag">
  {device.camera} &bull; {ETICHETE_PROTOCOL[device.protocol] || "Wi-Fi"}
</span>
            </div>

            <div className="ov-card-bottom">
        <span className="ov-live-info">
          {!isOnline ? (
              "În Standby (0.5W)"
          ) : (
              <>
                  {device.tip === "vacuum" &&
                      (device.inCuratare
                          ? `Aspiră (${device.suprafataCuratata} m² • Praf: ${device.nivelPraf}%)`
                          : `Baterie ${device.baterie}% • Ultra Dock`)}
                  {device.tip === "media" &&
                      (device.sursaKey === "HDMI 2"
                          ? `Gaming: ${formatSecunde ? formatSecunde(device.progresSecunde) : device.progresSecunde}`
                          : `${device.sursaKey}: ${device.titluMedia.slice(0, 18)}...`)}
                  {device.tip === "climate" && `${device.temperatura}°C • Umiditate ${device.umiditate}%`}
                  {device.tip === "coffee" &&
                      (device.inPreparare
                          ? `Prepară ${device.bauturaSelectata}...`
                          : `Gata • ${device.bauturaSelectata}`)}
              </>
          )}
        </span>
                <span className="ov-open-link">Controlează ➔</span>
            </div>
        </article>
    );
}