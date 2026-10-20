// frontend/src/components/DeviceIcon.jsx

export default function DeviceIcon({type, className = ""}) {
    switch (type) {
        case "vacuum":
            return (
                <svg
                    viewBox="0 0 36 36"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className={`dev-custom-icon ${className}`}
                >
                    {/* Corp principal aspirator */}
                    <circle cx="18" cy="18" r="15" fill="url(#vacBodyGrad)" stroke="#cbd5e1" strokeWidth="1.2"/>

                    {/* Bumper frontal */}
                    <path
                        d="M 6.5 13.5 A 15 15 0 0 1 29.5 13.5"
                        stroke="#94a3b8"
                        strokeWidth="1.4"
                        strokeLinecap="round"
                    />

                    {/* Turetă LiDAR centrală */}
                    <circle cx="18" cy="19.5" r="5" fill="#f1f5f9" stroke="#94a3b8" strokeWidth="1"/>
                    <circle cx="18" cy="19.5" r="3.2" fill="#0f172a"/>
                    {/* Diodă laser LiDAR */}
                    <circle cx="18.8" cy="18.8" r="1" fill="#ef4444"/>

                    {/* Butoane capacitive Power / Home */}
                    <rect x="15.5" y="8" width="5" height="2" rx="1" fill="#64748b"/>

                    <defs>
                        <linearGradient id="vacBodyGrad" x1="18" y1="3" x2="18" y2="33" gradientUnits="userSpaceOnUse">
                            <stop stopColor="#ffffff"/>
                            <stop offset="1" stopColor="#e2e8f0"/>
                        </linearGradient>
                    </defs>
                </svg>
            );

        case "media":
            return (
                <svg
                    viewBox="0 0 36 36"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className={`dev-custom-icon ${className}`}
                >
                    {/* Ecran TV OLED subțire */}
                    <rect
                        x="3"
                        y="6"
                        width="30"
                        height="19"
                        rx="2.5"
                        fill="url(#tvScreenGrad)"
                        stroke="#334155"
                        strokeWidth="1.2"
                    />
                    {/* Luciu panou sticlă */}
                    <path
                        d="M 4.5 7.5 L 24 7.5 L 7 23.5 L 4.5 23.5 Z"
                        fill="white"
                        fillOpacity="0.08"
                    />
                    {/* LED subtil Power */}
                    <circle cx="29.5" cy="22.5" r="0.8" fill="#38bdf8"/>
                    {/* Picior aluminiu */}
                    <path d="M 18 25 L 18 28.5" stroke="#94a3b8" strokeWidth="1.6" strokeLinecap="round"/>
                    <path d="M 12 28.5 L 24 28.5" stroke="#64748b" strokeWidth="1.8" strokeLinecap="round"/>

                    <defs>
                        <linearGradient id="tvScreenGrad" x1="3" y1="6" x2="33" y2="25" gradientUnits="userSpaceOnUse">
                            <stop stopColor="#0f172a"/>
                            <stop offset="0.6" stopColor="#1e293b"/>
                            <stop offset="1" stopColor="#0284c7" stopOpacity="0.4"/>
                        </linearGradient>
                    </defs>
                </svg>
            );

        case "climate":
            return (
                <svg
                    viewBox="0 0 36 36"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className={`dev-custom-icon ${className}`}
                >
                    <rect x="7" y="4" width="22" height="28" rx="8" fill="url(#sensorGrad)" stroke="#cbd5e1"
                          strokeWidth="1.2"/>
                    <path d="M 18 10 L 18 20" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round"/>
                    <circle cx="18" cy="23.5" r="3" fill="#10b981"/>
                    <defs>
                        <linearGradient id="sensorGrad" x1="18" y1="4" x2="18" y2="32" gradientUnits="userSpaceOnUse">
                            <stop stopColor="#ffffff"/>
                            <stop offset="1" stopColor="#f1f5f9"/>
                        </linearGradient>
                    </defs>
                </svg>
            );

        case "coffee":
            return (
                <svg
                    viewBox="0 0 36 36"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className={`dev-custom-icon ${className}`}
                >
                    <path d="M 7 12 H 25 V 21 C 25 25.5 21.5 28 16 28 C 10.5 28 7 25.5 7 21 Z" fill="#78350f"
                          stroke="#b45309" strokeWidth="1.2"/>
                    <path d="M 25 14 H 28 C 29.5 14 30.5 15.2 30.5 17 C 30.5 18.8 29.5 20 28 20 H 25" stroke="#b45309"
                          strokeWidth="1.5" strokeLinecap="round"/>
                    <ellipse cx="16" cy="12" rx="9" ry="2.2" fill="#d97706"/>
                    <path d="M 13 5 Q 14 7 13 9" stroke="#f59e0b" strokeWidth="1.2" strokeLinecap="round"/>
                    <path d="M 18 4 Q 19 6.5 18 9" stroke="#f59e0b" strokeWidth="1.2" strokeLinecap="round"/>
                </svg>
            );

        default:
            return <span>⚡</span>;
    }
}