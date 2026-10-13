# DeviceVault

A smart home and connected gadget management system designed for smart home enthusiasts to track, monitor network protocols, and manage devices across their living spaces.

## Data model

| Field | Type | Notes |
| :--- | :--- | :--- |
| `name` | text | required, device name, max 100 chars |
| `isOnline` | boolean | toggled from the list, default false (`Online` / `Offline`) |
| `protocol` | fixed values | `Wi-Fi`, `Zigbee`, `Bluetooth` |
| `category` | relation | `Multimedia`, `Cleaning`, `Sensors` (used from week 10) |
| `user` | relation | the owner of the device (used from week 11) |

Sample data used across all stages:
1. Roborock Robot Vacuum, active, Wi-Fi
2. Google TV Streamer, done, Bluetooth
3. Aqara Temperature Sensor, active, Zigbee

## How to run
Open `index.html` in a web browser (or run via Live Server). No build step, no server required for Stage 1.

## AI usage
| Tool | Used for |
| :--- | :--- |
| Gemini | Semantic HTML scaffolding, CSS Grid and Flexbox layouts, accessibility focus states, and dark theme variables. Details per stage: see the `ai-log/` folder. |

## Status
- [x] Stage 1: static mockup
- [ ] Stage 2: data logic in JavaScript
- [ ] Stage 3: React project initialization