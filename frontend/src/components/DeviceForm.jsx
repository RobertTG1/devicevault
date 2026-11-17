import { useState } from "react";

const TIPURI_DISPOZITIV = [
    { value: "climate", label: "Climatizare / Termostat" },
    { value: "vacuum", label: "Aspirator Robot" },
    { value: "media", label: "Media / TV" },
    { value: "coffee", label: "Espressor Smart" },
];

const NUME_MAX = 100;

export default function DeviceForm({ onAdd }) {
    const [nume, setNume] = useState("");
    const [camera, setCamera] = useState("");
    const [tip, setTip] = useState("climate");
    const [eroare, setEroare] = useState("");
    const [trimite, setTrimite] = useState(false);

    function valideaza() {
        const n = nume.trim();
        if (n === "") return "Numele dispozitivului este obligatoriu.";
        if (n.length > NUME_MAX) return `Numele are maximum ${NUME_MAX} de caractere.`;
        if (camera.trim() === "") return "Camera este obligatorie.";
        return "";
    }

    async function handleSubmit(e) {
        e.preventDefault();
        const mesaj = valideaza();
        if (mesaj) {
            setEroare(mesaj);
            return;
        }

        setEroare("");
        setTrimite(true);
        try {
            await onAdd({
                nume: nume.trim(),
                camera: camera.trim(),
                tip,
                protocol: "Wi-Fi",
                online: true,
                stare: "Activ",
            });
            setNume("");
            setCamera("");
            setTip("climate");
        } catch (err) {
            setEroare(err.message);
        } finally {
            setTrimite(false);
        }
    }

    return (
        <form className="task-form" onSubmit={handleSubmit} noValidate data-testid="form">
            <label>
                Nume dispozitiv
                <input
                    type="text"
                    value={nume}
                    onChange={(e) => setNume(e.target.value)}
                    placeholder="Ex: Senzor Temperatură Hol"
                    maxLength={NUME_MAX}
                    aria-invalid={Boolean(eroare)}
                    data-testid="form-title"
                />
            </label>

            <label>
                Cameră
                <input
                    type="text"
                    value={camera}
                    onChange={(e) => setCamera(e.target.value)}
                    placeholder="Ex: Living"
                    aria-invalid={Boolean(eroare)}
                    data-testid="form-camera"
                />
            </label>

            <label>
                Tip dispozitiv
                <select
                    value={tip}
                    onChange={(e) => setTip(e.target.value)}
                    data-testid="form-tip"
                >
                    {TIPURI_DISPOZITIV.map((t) => (
                        <option key={t.value} value={t.value}>
                            {t.label}
                        </option>
                    ))}
                </select>
            </label>

            {eroare && (
                <p className="error" data-testid="form-error">
                    {eroare}
                </p>
            )}

            <button type="submit" className="btn" disabled={trimite} data-testid="form-submit">
                {trimite ? "Se salvează..." : "Adaugă dispozitiv"}
            </button>
        </form>
    );
}