# Stage 1: AI log

## Tools
- Gemini

## Conversations
- Shared Session (CSS Grid layout configuration, dark mode variable setup, semantic tags)

## Key requests
### 1. Mockup Structure and Responsive Layout
- Asked: How to build a semantic HTML structure with a 1fr 2fr CSS Grid container, accessible form, and dark mode palette for a smart home device tracker.
- Got: HTML5 mockup structure, CSS variables for light/dark themes, and Flexbox cards.
- Changed or rejected: Adapted all entities to the smart home domain (protocols as badges, online/offline states, device fields).

## What I learned / what did not work
Learned how to centralize colors using CSS variables in `:root` and adapt the entire layout for dark mode seamlessly via `@media (prefers-color-scheme: dark)`. Also understood how `:focus-visible` ensures keyboard accessibility without breaking mouse click ergonomics.