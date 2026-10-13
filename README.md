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

- [ ] ## Stage 1 Verification Table

| ID | Requirement | Where | How to check |
| :--- | :--- | :--- | :--- |
| S1-R1 | README: description, fields, sample data, how to run | [README.md](README.md) | Read documentation |
| S1-R2 | AI usage section | [README.md#ai-usage](README.md) | Read documentation |
| S1-R3 | AI log for stage 1 | [ai-log/etapa-01.md](ai-log/etapa-01.md) | Check file content |
| S1-R4 | Header, form (text + select), 3 cards with own data | [index.html](index.html) | Open in browser |
| S1-R5 | Finished card looks different | [style.css](style.css) | Look at line-through styling on `.item-card.done` |
| S1-R6 | 2 columns on desktop, 1 under 700px | [style.css](style.css) | Resize browser window under 700px |
| S1-R7 | Visible focus, readable dark theme | [style.css](style.css) | Press Tab; test with DevTools dark mode emulation |
| S1-R8 | Commit "Stage 1" pushed | [Commit history](https://github.com/RobertTG1/devicevault/commits/main) | Verify commit messages |
