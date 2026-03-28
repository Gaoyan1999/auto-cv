You are designing UI for a desktop-first web application: a “Job Application Assistant” (local-first, no login). Follow Pencil web-app rules: functional product UI only—no marketing landing pages, no long promotional scroll.

diVISUAL DIRECTION — “Ditto-inspired” (reference: Ditto on Mobbin — clean product-marketing minimalism translated into app chrome):

- Overall: calm, airy, editorial minimalism. Generous whitespace, restrained decoration, strong typographic hierarchy.
- Background: warm off-white or very light gray (#FAFAF9–#F5F5F4 range), not pure harsh white.
- Text: near-black for primary (#0A0A0A–#171717), muted gray for secondary (#737373–#A3A3A3).
- Surfaces: subtle 1px hairline borders (#E5E5E5–#E7E5E4) OR ultra-light fills; avoid heavy drop shadows; if any shadow, keep it soft and barely visible.
- Corners: small-to-medium radius (8–12px) on cards, inputs, and panels—consistent everywhere.
- Accent: single restrained accent only for primary actions and focus rings (e.g. muted blue-violet or cool blue), low saturation—never rainbow or loud gradients.
- Typography: modern neo-grotesque / system UI feel (Inter-like). Clear scale: page title > section title > body > captions. Comfortable line height for long reading (resume + JD).
- Iconography: thin stroke, minimal set; never replace critical labels with icons alone.
- Density: “medium” default—readable for long text; avoid cramped dashboards.

PRODUCT CONTEXT (must reflect in layout and copy):

- Users edit a resume in Markdown (main workspace).
- Users paste a plain-text job description (JD) in a large area.
- The app shows structured analysis: fit summary, gaps, traceability to JD requirements and resume sections—honest language, no “hire probability” scores.
- Rewrite suggestions: show side-by-side or diff-style proposals with explicit Accept / Reject; never imply silent overwrite.
- Privacy: short note that data stays in the browser by default; include Export / backup affordance.

SCREENS TO GENERATE (high-fidelity, consistent system):

1. App shell: top bar with product name + subtle privacy/export entry; optional narrow left nav or single-column layout if simpler—prefer ONE dominant region (editor OR analysis) with secondary panel.
2. Resume editor view: markdown editing area + preview toggle or split; placeholder realistic resume text.
3. JD input view: large textarea, paste hint, lightweight validation empty state (“Paste a job description to analyze”).
4. Analysis results view: structured sections (Fit / Gaps / Traceability), list rows with calm separators; loading and empty states.
5. Rewrite review view: suggested change blocks with Accept / Reject; show grounding to original bullet.

STATES: include loading, empty, and error for analysis—visually consistent with Ditto-like minimalism.

Deliver: cohesive component styling (buttons, inputs, cards, lists), spacing scale, and the screens above in one visual language. No stock hero photography unless extremely subtle and functional. No decorative illustrations unless minimal line icons