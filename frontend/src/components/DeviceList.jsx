// frontend/src/components/DeviceList.jsx
// Componentă pentru randarea întregii liste de dispozitive
import DeviceCard from "./DeviceCard.jsx";

export default function DeviceList({devices, onSelectDevice, onTogglePower, formatSecunde}) {
    // 1. Verificare listă goală (randare condiționată prin return timpuriu)
    if (!devices || devices.length === 0) {
        return (
            <div className="empty-list-panel">
                <span className="empty-icon">🔌</span>
                <p className="empty">Nu există niciun dispozitiv configurat.</p>
                <span className="empty-sub">Toate nodurile IoT sunt offline sau lista este goală.</span>
            </div>
        );
    }

    // 2. Randare cu map() și atributul obligatoriu key={device.id}
    return (
        <div className="overview-devices-grid">
            {devices.map((device) => (
                <DeviceCard
                    key={device.id}
                    device={device}
                    onSelectDevice={onSelectDevice}
                    onTogglePower={onTogglePower}
                    formatSecunde={formatSecunde}
                />
            ))}
        </div>
    );
}