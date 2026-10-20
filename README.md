# DeviceVault

A smart home and connected gadget management system designed for smart home enthusiasts to track, monitor network
protocols, and manage devices across their living spaces.

## Data model

| Field      | Type         | Notes                                                       |
|:-----------|:-------------|:------------------------------------------------------------|
| `name`     | text         | required, device name, max 100 chars                        |
| `isOnline` | boolean      | toggled from the list, default false (`Online` / `Offline`) |
| `protocol` | fixed values | `Wi-Fi`, `Zigbee`, `Bluetooth`                              |
| `category` | relation     | `Multimedia`, `Cleaning`, `Sensors` (used from week 10)     |
| `user`     | relation     | the owner of the device (used from week 11)                 |

Sample data used across all stages:

1. Roborock Robot Vacuum, active, Wi-Fi
2. Google TV Streamer, done, Bluetooth
3. Aqara Temperature Sensor, active, Zigbee

## How to run

```bash
cd frontend
npm install
npm run dev
```

Then open the address printed in the terminal (http://localhost:5173).

## AI usage

| Tool   | Used for                                                                                                                                                    |
|:-------|:------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Gemini | Semantic HTML scaffolding, CSS Grid and Flexbox layouts, accessibility focus states, and dark theme variables. Details per stage: see the `ai-log/` folder. |

## Stage 2: data logic

Plain JavaScript, no DOM. `dispozitive.js` holds the array of smart home devices and the pure functions that read and
transform it. Results are logged directly in the browser console (F12).

## Stage 3: Vite and React project

The app now lives in `frontend/`, built with Vite. The data from Stage 2 moved into the main component; the list is
rendered raw as JSON.

## Stage 4: components

The device dashboard list is rendered dynamically from data through two dedicated React components:

- `DeviceList` receives the whole array through props, handles the empty list conditional state, and renders one card
  per item.
- `DeviceCard` receives a single item through props and displays it.

## Status

- [x] Stage 1: HTML & CSS mockups
- [x] Stage 2: JavaScript data structures & methods
- [x] Stage 3: Vite and React project
- [x] Stage 4: components rendered from data
- [ ] Stage 5: local state and events
-

## Status

- [x] Stage 1: static mockup
- [x] Stage 2: data logic in JavaScript
- [x] Stage 3: React project initialization

## Stage 1 Verification Table

| ID    | Requirement                                          | Where                                                                   | How to check                                      |
|:------|:-----------------------------------------------------|:------------------------------------------------------------------------|:--------------------------------------------------|
| S1-R1 | README: description, fields, sample data, how to run | [README.md](README.md)                                                  | Read documentation                                |
| S1-R2 | AI usage section                                     | [README.md#ai-usage](README.md)                                         | Read documentation                                |
| S1-R3 | AI log for stage 1                                   | [ai-log/etapa-01.md](ai-log/etapa-01.md)                                | Check file content                                |
| S1-R4 | Header, form (text + select), 3 cards with own data  | [index.html](index.html)                                                | Open in browser                                   |
| S1-R5 | Finished card looks different                        | [style.css](style.css)                                                  | Look at line-through styling on `.item-card.done` |
| S1-R6 | 2 columns on desktop, 1 under 700px                  | [style.css](style.css)                                                  | Resize browser window under 700px                 |
| S1-R7 | Visible focus, readable dark theme                   | [style.css](style.css)                                                  | Press Tab; test with DevTools dark mode emulation |
| S1-R8 | Commit "Stage 1" pushed                              | [Commit history](https://github.com/RobertTG1/devicevault/commits/main) | Verify commit messages                            |

## Stage 2 Verification Table

| ID    | Requirement                              | Where                                                                   | How to check                                  |
|:------|:-----------------------------------------|:------------------------------------------------------------------------|:----------------------------------------------|
| S2-R1 | JS file linked, logs on page load        | [index.html](index.html)                                                | Open page, press F12 (Console)                |
| S2-R2 | 3+ items with id, name, state, tag       | [dispozitive.js](dispozitive.js)                                        | Read `dispozitive` array declaration          |
| S2-R3 | list, count, search, add, toggle, delete | [dispozitive.js](dispozitive.js)                                        | Inspect browser console output                |
| S2-R4 | add rejects empty name and invalid tag   | [dispozitive.js](dispozitive.js)                                        | Check last 2 warning lines in console         |
| S2-R5 | original array unchanged after add       | [dispozitive.js](dispozitive.js)                                        | Check "Originalul a rămas cu: 3" console line |
| S2-R6 | README Stage 2 section + AI log          | [README.md](README.md), [ai-log/etapa-02.md](ai-log/etapa-02.md)        | Read documentation                            |
| S2-R7 | Commit "Stage 2" pushed                  | [Commit history](https://github.com/RobertTG1/devicevault/commits/main) | Check commit history                          |

## Stage 3 Verification Table

| ID    | Requirement                             | Where                                                                   | How to check                          |
|:------|:----------------------------------------|:------------------------------------------------------------------------|:--------------------------------------|
| S3-R1 | npm run dev starts without errors       | [frontend/package.json](frontend/package.json)                          | Run `npm install`, then `npm run dev` |
| S3-R2 | app name and counter computed from data | [frontend/src/App.jsx](frontend/src/App.jsx)                            | Edit data array, check hot reload     |
| S3-R3 | data from README, not from example      | [frontend/src/App.jsx](frontend/src/App.jsx)                            | Compare with README data model        |
| S3-R4 | stage 1 styles reused                   | [frontend/src/App.css](frontend/src/App.css)                            | Inspect rendered page styles          |
| S3-R5 | node_modules ignored, build passes      | [frontend/.gitignore](frontend/.gitignore)                              | Run `npm run build`                   |
| S3-R6 | README Stage 3 section + AI log         | [README.md](README.md), [ai-log/etapa-03.md](ai-log/etapa-03.md)        | Read documentation                    |
| S3-R7 | Commit "Stage 3" pushed                 | [Commit history](https://github.com/RobertTG1/devicevault/commits/main) | Check commit history                  |

### Stage 4 Checklist

| ID    | Requirement                         | Where                                  | How to check                                   |
|:------|:------------------------------------|:---------------------------------------|:-----------------------------------------------|
| S4-R1 | 2+ components in src/components/    | frontend/src/components/               | Verify DeviceCard.jsx and DeviceList.jsx exist |
| S4-R2 | card receives data through props    | frontend/src/components/DeviceCard.jsx | Inspect component arguments ({ device })       |
| S4-R3 | map + key={id}, no console warnings | frontend/src/components/DeviceList.jsx | Open F12 Console, no key warnings              |
| S4-R4 | message for empty list              | frontend/src/components/DeviceList.jsx | Test with empty array []                       |
| S4-R5 | state changes the card look         | frontend/src/components/DeviceCard.jsx | Toggle device online/offline power state       |
| S4-R6 | README Stage 4 section + AI log     | README.md, ai-log/etapa-04.md          | Read docs                                      |
| S4-R7 | commit "Stage 4" pushed             | GitHub repository                      | Check git log                                  |
