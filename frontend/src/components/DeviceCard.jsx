// frontend/src/components/DeviceCard.jsx
import DeviceIcon from "./DeviceIcon.jsx";

const ETICHETE_PROTOCOL = {
    "Wi-Fi": "Rețea Wi-Fi 5 GHz",
};

export default function DeviceCard({
                                       device,
                                       onSelectDevice,
                                       onToggle,
                                       onDelete,
                                       formatSecunde,
                                   }) {
    const isOnline = device.online;
    const isGoogleTvGlow = device.id === 2 && isOnline && device.redare;

    return (
        <article
            className={`overview-card ${!isOnline ? "is-offline" : ""} ${
                isGoogleTvGlow ? "overview-ambilight-card" : ""
            }`}
            style={
                isGoogleTvGlow
                    ? { "--card-glow": device.glowColor || "rgba(2, 132, 199, 0.4)" }
                    : {}
            }
            onClick={() => onSelectDevice && onSelectDevice(device)}
        >
            <div className="ov-card-top">
                {/* Checkbox controlat + Pictogramă + Nume */}
                <label
                    className="task-main"
                    onClick={(e) => e.stopPropagation()}
                >
                    <input
                        type="checkbox"
                        checked={isOnline}
                        onChange={() => onToggle(device.id)}
                        aria-label={`Comută starea pentru ${device.nume}`}
                    />
                    <div className="ov-icon-box">
                        <DeviceIcon type={device.tip} />
                    </div>
                </label>

                <div className="card-top-actions" onClick={(e) => e.stopPropagation()}>
                    <button
                        type="button"
                        className={`power-switch-btn small ${isOnline ? "on" : "off"}`}
                        onClick={() => onToggle(device.id)}
                        aria-label={`Pornire sau oprire ${device.nume}`}
                    >
                        {isOnline ? "PORNIT" : "OPRIT"}
                    </button>

                    <button
                        type="button"
                        className="btn-danger"
                        onClick={() => onDelete(device.id)}
                        aria-label={`Șterge ${device.nume}`}
                    >
                        Șterge
                    </button>
                </div>
            </div>

            <div className="ov-card-mid">
                <h4 className={!isOnline ? "text-strikethrough" : ""}>{device.nume}</h4>
                <span className="ov-room-tag">
          {device.camera} &bull;{" "}
                    {ETICHETE_PROTOCOL[device.protocol] || "Rețea Wi-Fi 5 GHz"}
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
                          : `${device.sursaKey}: ${device.titluMedia ? device.titluMedia.slice(0, 18) : "Redare"}...`)}
                  {device.tip === "climate" &&
                      `${device.temperatura?.toFixed(1)}°C (Setat: ${device.temperaturaTinta?.toFixed(1)}°C)`}
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