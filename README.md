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

## Stage 5: local state and events
The application manages interactive UI state via React's useState hook with strict immutability:

Device Management & Actions: Real-time state updates for toggling device connectivity (handleToggle via map), deleting nodes (handleDelete via filter), and selecting active items.

Dynamic Theme Engine: Bi-directional dark/light mode toggle (handleTema) synchronized directly with the data-theme attribute on the root <html> element and persisted in localStorage (dv_dark_v9).

Live Activity Log: Real-time event auditing logging every critical action (theme toggles, power state transitions) with localized timestamps (HH:MM:SS).

Room Navigation: Synchronized sidebar room filtering (Living, Dormitor, Bucătărie, Balcon) mapping devices to spaces.

# Stage 6: data from a mock API

Device data is persisted in `frontend/db.json` and served locally via `json-server` on port `3001`:

- `api.js` encapsulates all REST HTTP requests (`fetchDevices`, `fetchDevice`, `createDevice`, `updateDevice`, `deleteDevice`) and validates response statuses.
- `DevicesPage` loads the initial device list asynchronously on mount and handles conditional loading and error states.

# Stage 7: form and validation

Devices can be added from the main view through a controlled form, and every change is confirmed by the API before updating the list:

- `DeviceForm` manages controlled inputs, runs client-side validation before submission, highlights invalid fields (`aria-invalid`), and resets after a successful `POST`.
- `DevicesPage` synchronizes additions (`POST`), online/standby state toggles (`PATCH`), and deletions (`DELETE`) directly with the server.
- Standardized `data-testid` attributes (`form`, `form-title`, `form-camera`, `form-tip`, `form-submit`, `item`, `item-toggle`, `item-title`, `item-delete`, `empty`) support automated end-to-end tests.

# Stage 8: routing and detail page

Client-side navigation is powered by `react-router-dom` without page reloads, paired with scoped CSS Modules styling:

- `App.jsx` renders the global `<NavLink>` navigation bar styled with `App.module.css` and configures `<Routes>` across four views.
- `DevicesPage` renders the main Smart Home Hub on `/`, while `DeviceCard` links each device to `/devices/:id`.
- `DeviceDetaliuPage` reads `:id` via `useParams()`, fetches the single device from the API, and supports live power toggling and deletion with `useNavigate()`.
- `DesprePage` (`/despre`) and `NotFoundPage` (`*`) handle the project overview and 404 fallback routes.



## Status

- [x] Stage 1: static mockup
- [x] Stage 2: data logic in JavaScript
- [x] Stage 3: React project initialization
- [x] Stage 4: components rendered from data
- [x] Stage 5: local state and events
- [x] Stage 6: data from a mock API
- [x] Stage 7: form and validation
- [x] Stage 8: routing and detail page

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


### Stage 5 Verification Table

| ID    | Requirement                                  | Where                                                                   | How to check                                           |
|:------|:---------------------------------------------|:------------------------------------------------------------------------|:-------------------------------------------------------|
| S5-R1 | State managed with useState in App           | [frontend/src/App.jsx](frontend/src/App.jsx)                            | Inspect devices and theme useState definitions         |
| S5-R2 | Device toggle updates state immutably        | [frontend/src/App.jsx](frontend/src/App.jsx)                            | Click toggle button; verify state update via map       |
| S5-R3 | Device delete updates state immutably        | [frontend/src/App.jsx](frontend/src/App.jsx)                            | Click delete button; verify state update via filter    |
| S5-R4 | Active device & room navigation              | [frontend/src/App.jsx](frontend/src/App.jsx)                            | Click rooms and device cards; check active state        |
| S5-R5 | Header counters updated from state           | [frontend/src/App.jsx](frontend/src/App.jsx)                            | Verify active/total counters change upon actions       |
| S5-R6 | Dynamic theme toggle with data-theme & storage| [frontend/src/App.jsx](frontend/src/App.jsx), [frontend/src/App.css](frontend/src/App.css) | Toggle Dark/Light; check DOM data-theme & reload page |
| S5-R7 | Live event audit log with timestamps         | [frontend/src/App.jsx](frontend/src/App.jsx)                            | Open Event Log; check new entries with HH:MM:SS time   |
| S5-R8 | README Stage 5 section + AI log + pushed     | [README.md](README.md), [ai-log/etapa-05.md](ai-log/etapa-05.md)        | Read docs; verify "Stage 5" commit on GitHub           |


### Stage 6 Verification Table

| ID | Requirement | Where |
|:---|:---|:---|
| S6-R1 | Mock REST API configured in `db.json` & `package.json` | [frontend/db.json](frontend/db.json), [frontend/package.json](frontend/package.json) |
| S6-R2 | Centralized `fetch` API helper with `res.ok` checks | [frontend/src/api.js](frontend/src/api.js) |
| S6-R3 | Initial devices fetched asynchronously on mount | [frontend/src/pages/DevicesPage.jsx](frontend/src/pages/DevicesPage.jsx) |
| S6-R4 | Loading indicator rendered during fetch (`data-testid="loading"`) | [frontend/src/pages/DevicesPage.jsx](frontend/src/pages/DevicesPage.jsx) |
| S6-R5 | Error banner rendered on failed requests (`data-testid="error"`) | [frontend/src/pages/DevicesPage.jsx](frontend/src/pages/DevicesPage.jsx) |
| S6-R6 | Empty state rendered when API returns no devices | [frontend/src/components/DeviceList.jsx](frontend/src/components/DeviceList.jsx) |
| S6-R7 | Effect cleanup prevents state updates after unmount | [frontend/src/pages/DevicesPage.jsx](frontend/src/pages/DevicesPage.jsx) |
| S6-R8 | README Stage 6 section + AI log + pushed | [README.md](README.md), [ai-log/etapa-06.md](ai-log/etapa-06.md) |

### Stage 7 Verification Table

| ID | Requirement | Where |
|:---|:---|:---|
| S7-R1 | Controlled form component for adding devices | [frontend/src/components/DeviceForm.jsx](frontend/src/components/DeviceForm.jsx) |
| S7-R2 | Client-side validation with error message & `aria-invalid` | [frontend/src/components/DeviceForm.jsx](frontend/src/components/DeviceForm.jsx), [frontend/src/App.css](frontend/src/App.css) |
| S7-R3 | Create device persisted via `POST` before state update | [frontend/src/api.js](frontend/src/api.js), [frontend/src/pages/DevicesPage.jsx](frontend/src/pages/DevicesPage.jsx) |
| S7-R4 | Toggle device online/standby persisted via `PATCH` | [frontend/src/api.js](frontend/src/api.js), [frontend/src/pages/DevicesPage.jsx](frontend/src/pages/DevicesPage.jsx) |
| S7-R5 | Delete device persisted via `DELETE` | [frontend/src/api.js](frontend/src/api.js), [frontend/src/pages/DevicesPage.jsx](frontend/src/pages/DevicesPage.jsx) |
| S7-R6 | Submit button disabled during pending API request | [frontend/src/components/DeviceForm.jsx](frontend/src/components/DeviceForm.jsx) |
| S7-R7 | Standardized `data-testid` attributes on form and list items | [frontend/src/components/DeviceForm.jsx](frontend/src/components/DeviceForm.jsx), [frontend/src/components/DeviceCard.jsx](frontend/src/components/DeviceCard.jsx), [frontend/src/components/DeviceList.jsx](frontend/src/components/DeviceList.jsx) |
| S7-R8 | README Stage 7 section + AI log + pushed | [README.md](README.md), [ai-log/etapa-07.md](ai-log/etapa-07.md) |

### Stage 8 Verification Table

| ID | Requirement | Where |
|:---|:---|:---|
| S8-R1 | Application wrapped in `BrowserRouter` | [frontend/src/main.jsx](frontend/src/main.jsx) |
| S8-R2 | Route definitions for `/`, `/devices/:id`, `/despre`, and `*` | [frontend/src/App.jsx](frontend/src/App.jsx) |
| S8-R3 | Global navigation bar using `NavLink` with active state | [frontend/src/App.jsx](frontend/src/App.jsx) |
| S8-R4 | Device cards link to detail route `/devices/:id` | [frontend/src/components/DeviceCard.jsx](frontend/src/components/DeviceCard.jsx) |
| S8-R5 | Detail page reads `:id` via `useParams()` and fetches item | [frontend/src/pages/DeviceDetaliuPage.jsx](frontend/src/pages/DeviceDetaliuPage.jsx), [frontend/src/api.js](frontend/src/api.js) |
| S8-R6 | Detail page supports back navigation and delete redirect (`useNavigate`) | [frontend/src/pages/DeviceDetaliuPage.jsx](frontend/src/pages/DeviceDetaliuPage.jsx) |
| S8-R7 | About page (`/despre`) and 404 fallback page (`*`) | [frontend/src/pages/DesprePage.jsx](frontend/src/pages/DesprePage.jsx), [frontend/src/pages/NotFoundPage.jsx](frontend/src/pages/NotFoundPage.jsx) |
| S8-R8 | Scoped styling implemented via CSS Modules | [frontend/src/App.module.css](frontend/src/App.module.css), [frontend/src/App.jsx](frontend/src/App.jsx) |
| S8-R9 | README Stage 8 section + AI log + pushed | [README.md](README.md), [ai-log/etapa-08.md](ai-log/etapa-08.md) |