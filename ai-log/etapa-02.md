# Stage 2: AI log

## Tools
- Gemini

## Conversations
- Shared Session (Immutable JavaScript array methods, state toggling, data validation)

## Key requests
### 1. Data Logic Implementation & Immutability
- Asked: How to implement immutable operations (map, filter, reduce) for adding, toggling, and deleting items while ensuring the original array is never mutated.
- Got: Pure functions utilizing spread operators (`[...list, newItem]`, `{ ...item, online: !item.online }`) and auto-incrementing ID computation using `reduce`.
- Changed or rejected: Adapted all naming and validation constraints to the DeviceVault domain (protocols, online states).

## What I learned / what did not work
Understood why array mutation via methods like `.push()` breaks change detection in modern reactive frameworks like React, and how pure functional programming ensures predictable state management.