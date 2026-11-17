import { useState } from "react";
import { Routes, Route, NavLink } from "react-router-dom";
import "./App.css";
import styles from "./App.module.css";
import DevicesPage from "./pages/DevicesPage.jsx";
import DeviceDetaliuPage from "./pages/DeviceDetaliuPage.jsx";
import DesprePage from "./pages/DesprePage.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";

export default function App() {
    const [darkMode, setDarkMode] = useState(() => {
        const saved = localStorage.getItem("dv_dark_v9");
        const isDark = saved !== null ? saved === "true" : true;
        if (typeof document !== "undefined") {
            document.documentElement.dataset.theme = isDark ? "dark" : "light";
        }
        return isDark;
    });

    if (typeof document !== "undefined") {
        document.documentElement.dataset.theme = darkMode ? "dark" : "light";
    }

    function handleToggleTheme() {
        const nextMode = !darkMode;
        setDarkMode(nextMode);
        if (typeof document !== "undefined") {
            document.documentElement.dataset.theme = nextMode ? "dark" : "light";
        }
        localStorage.setItem("dv_dark_v9", String(nextMode));
    }

    return (
        <div className={`hub-viewport ${darkMode ? "dark-theme" : ""}`}>
            <div className="hub-device-frame">
                <div className="hub-notch"></div>

                <nav className={styles.topBar} aria-label="Navigare principală">
                    <span className={styles.brand}>DeviceVault Hub</span>
                    <div className={styles.navLinks}>
                        <NavLink
                            to="/"
                            end
                            className={({ isActive }) =>
                                isActive ? `${styles.link} ${styles.activeLink}` : styles.link
                            }
                        >
                            Dispozitive
                        </NavLink>
                        <NavLink
                            to="/despre"
                            className={({ isActive }) =>
                                isActive ? `${styles.link} ${styles.activeLink}` : styles.link
                            }
                        >
                            Despre
                        </NavLink>
                    </div>
                </nav>

                <Routes>
                    <Route
                        path="/"
                        element={
                            <DevicesPage
                                darkMode={darkMode}
                                onToggleTheme={handleToggleTheme}
                            />
                        }
                    />
                    <Route path="/devices/:id" element={<DeviceDetaliuPage />} />
                    <Route path="/despre" element={<DesprePage />} />
                    <Route path="*" element={<NotFoundPage />} />
                </Routes>
            </div>
        </div>
    );
}