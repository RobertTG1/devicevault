import { Link } from "react-router-dom";
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
    const isOnline = Boolean(device.online);
    const isGoogleTvGlow = String(device.id) === "2" && isOnline && device.redare;

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
            data-testid="item"
            data-id={device.id}
        >
            <div className="ov-card-top">
                <label className="task-main" onClick={(e) => e.stopPropagation()}>
                    <input
                        type="checkbox"
                        checked={isOnline}
                        onChange={() => onToggle(device.id)}
                        aria-label={`Comută starea pentru ${device.nume}`}
                        data-testid="item-toggle"
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
                        data-testid="item-delete"
                    >
                        Șterge
                    </button>
                </div>
            </div>

            <div className="ov-card-mid" onClick={(e) => e.stopPropagation()}>
                <h4
                    className={!isOnline ? "text-strikethrough" : ""}
                    data-testid="item-title"
                >
                    <Link to={`/devices/${device.id}`}>{device.nume}</Link>
                </h4>
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
                          ? `Aspiră (${device.suprafataCuratata ?? 0} m² • Praf: ${device.nivelPraf ?? 0}%)`
                          : `Baterie ${device.baterie ?? 100}% • Ultra Dock`)}
                  {device.tip === "media" &&
                      (device.sursaKey === "HDMI 2"
                          ? `Gaming: ${formatSecunde ? formatSecunde(device.progresSecunde ?? 0) : device.progresSecunde}`
                          : `${device.sursaKey || "Media"}: ${
                              device.titluMedia
                                  ? `${device.titluMedia.slice(0, 18)}...`
                                  : device.stare || "Redare activă"
                          }`)}
                  {device.tip === "climate" &&
                      (device.temperatura !== undefined
                          ? `${device.temperatura.toFixed(1)}°C (Setat: ${(device.temperaturaTinta ?? 23).toFixed(1)}°C)`
                          : device.stare || "Senzor activ")}
                  {device.tip === "coffee" &&
                      (device.inPreparare
                          ? `Prepară ${device.bauturaSelectata}...`
                          : `Gata • ${device.bauturaSelectata || "Espresso"}`)}
              </>
          )}
        </span>
                <Link
                    to={`/devices/${device.id}`}
                    className="ov-open-link"
                    onClick={(e) => e.stopPropagation()}
                >
                    Detalii ➔
                </Link>
            </div>
        </article>
    );
}