// frontend/src/components/DeviceList.jsx
import DeviceCard from "./DeviceCard.jsx";

export default function DeviceList({
                                       devices,
                                       activeDeviceId,
                                       onSelectDevice,
                                       onToggle,
                                       onDelete,
                                       formatSecunde,
                                   }) {
    if (!devices || devices.length === 0) {
        return (
            <div className="empty-devices-state">
                <p className="empty">Nu există niciun dispozitiv înregistrat în rețea.</p>
                <span className="empty-sub">
          Toate nodurile au fost eliminate. Apasă pe &bdquo;Reset Default&ldquo; din meniul lateral pentru a restaura dispozitivele.
        </span>
            </div>
        );
    }

    return (
        <div className="overview-grid">
            {devices.map((device) => (
                <DeviceCard
                    key={device.id}
                    device={device}
                    isSelected={activeDeviceId === device.id}
                    onSelectDevice={onSelectDevice}
                    onToggle={onToggle}
                    onDelete={onDelete}
                    formatSecunde={formatSecunde}
                />
            ))}
        </div>
    );
}