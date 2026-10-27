import React, { useState, useEffect } from "react";

export default function ThermostatCard({ device, onUpdateDevice }) {
    // Citim direct proprietățile existente în starea ta: temperatura și umiditate
    const [currentTemp, setCurrentTemp] = useState(device?.temperatura ?? 22.1);
    const [targetTemp, setTargetTemp] = useState(device?.temperaturaTinta ?? 24.0);
    const [humidity, setHumidity] = useState(device?.umiditate ?? 48);
    const [isHeating, setIsHeating] = useState(false);
    const [isSimulating, setIsSimulating] = useState(true);

    // Sincronizare la pornire sau dacă device-ul se modifică extern
    useEffect(() => {
        if (device?.temperatura !== undefined) setCurrentTemp(device.temperatura);
        if (device?.umiditate !== undefined) setHumidity(device.umiditate);
    }, [device?.id]);

    // Simulare dinamică Wokwi / DHT22
    useEffect(() => {
        if (!isSimulating) return;

        const interval = setInterval(() => {
            setCurrentTemp((prev) => {
                const delta = isHeating ? 0.1 : -0.05;
                const next = parseFloat((prev + delta + (Math.random() * 0.04 - 0.02)).toFixed(1));
                return next;
            });
        }, 2000);

        return () => clearInterval(interval);
    }, [isSimulating, isHeating]);

    // Actualizează starea globală a dispozitivului ca să se sincronizeze și bannerul de sus
    useEffect(() => {
        const heatingActive = currentTemp < targetTemp - 0.2;
        setIsHeating(heatingActive);

        if (onUpdateDevice && device) {
            onUpdateDevice({
                ...device,
                temperatura: currentTemp,
                umiditate: humidity,
                temperaturaTinta: targetTemp,
                stareIncalzire: heatingActive,
            });
        }
    }, [currentTemp, targetTemp, humidity]);

    // Calcul arc circular SVG
    const minTemp = 15;
    const maxTemp = 30;
    const normalizedValue = Math.min(Math.max((currentTemp - minTemp) / (maxTemp - minTemp), 0), 1);
    const strokeDashoffset = 314 - 314 * normalizedValue;

    return (
        <div className={`thermostat-hub-card ${isHeating ? "is-heating" : ""}`}>
            <div className="thermostat-header">
                <div>
                    <h4>{device?.nume || device?.name || "Termostat Inteligent Balcon"}</h4>
                    <span className="thermostat-badge">
            {isHeating ? "🔥 Flacără Activă (Încălzire)" : "🍃 Repaus (Temperatură Atinsă)"}
          </span>
                </div>
                <button
                    className="btn-sim-toggle"
                    onClick={() => setIsSimulating(!isSimulating)}
                    title="Comută simularea Wokwi"
                >
                    {isSimulating ? "Sim Wokwi: ON" : "Sim Wokwi: PAUZĂ"}
                </button>
            </div>

            <div className="gauge-container">
                <svg className="gauge-svg" viewBox="0 0 120 120">
                    <circle className="gauge-bg" cx="60" cy="60" r="50" />
                    <circle
                        className="gauge-progress"
                        cx="60"
                        cy="60"
                        r="50"
                        style={{ strokeDashoffset }}
                    />
                </svg>

                <div className="gauge-readout">
                    <span className="gauge-temp-val">{currentTemp.toFixed(1)}°C</span>
                    <span className="gauge-sub">Setat: {targetTemp.toFixed(1)}°C</span>
                </div>
            </div>

            <div className="thermostat-controls">
                <button
                    className="btn-temp-step"
                    onClick={() => setTargetTemp((t) => Math.max(16, parseFloat((t - 0.5).toFixed(1))))}
                >
                    -
                </button>
                <div className="thermostat-target-display">
                    <span className="label">Țintă</span>
                    <span className="value">{targetTemp.toFixed(1)}°C</span>
                </div>
                <button
                    className="btn-temp-step"
                    onClick={() => setTargetTemp((t) => Math.min(28, parseFloat((t + 0.5).toFixed(1))))}
                >
                    +
                </button>
            </div>

            <div className="thermostat-footer">
                <span>Umiditate: <strong>{humidity}%</strong></span>
                <span>Senzor: <strong>DHT22 (Wokwi)</strong></span>
            </div>
        </div>
    );
}