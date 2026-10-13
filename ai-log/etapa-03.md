# Stage 3: AI log

## Tools
- Gemini

## Conversations
- Shared Session (Vite project scaffolding, React JSX migration, dynamic data calculation)

## Key requests
### 1. Vite & React Initialization
- Asked: How to initialize Vite React, clean boilerplate files, migrate Stage 1 CSS variables, and compute header badges directly from the data array.
- Got: Setup instructions for `../frontend/src/App.jsx`, stylesheet import in `main.jsx`, and raw JSON rendering inside `<pre>`.
- Changed or rejected: Kept exact theme colors, naming, and data models matching the DeviceVault specifications.

## What I learned / what did not work
Learned how `package.json` coordinates project dependencies, how JSX differs from standard HTML syntax, and why fixed state arrays should reside outside the component body to avoid re-instantiation on each render cycle.