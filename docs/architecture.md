# FoveaRx One — implementation contract

## Scope and acceptance

1. One real, reusable three-dimensional prescription-glasses definition, with individually identified optical, structural and electronic components.
2. Twelve reversible scroll chapters with one persistent renderer, paired with deliberate camera poses.
3. Five directly reachable routes; prototype inspection, orthographic views, explosion, component selection and seven conceptual simulations work.
4. Complete educational company/production/specification content and four verified scientific references; proposed capabilities clearly distinguished from evidence.
5. Responsive layouts at 360, 390, 430, 768, 1440 and 1920 pixels; keyboard alternatives, reduced motion and WebGL fallback.
6. Typecheck, lint, production prerender, browser tests and rendered review before preview and production in the original Vercel project.

## Architecture

React + TypeScript + Vite. Three.js procedural geometry replaces the former CSS illustration. GSAP ScrollTrigger maps native scroll to a continuous scene progress value. No artificial scroll engine. PBR materials and a procedural reflection environment avoid third-party imagery or remote runtime assets. Inter is served locally.

The homepage is a single product narrative. `/tecnologia` owns principles, simulations, limitations and literature. `/engenharia` owns component inspection, orthographic projection and materials. `/empresa` owns the fictional corporate structure and educational production model. `/prototipo` owns direct manipulation, simulations and the full specification sheet. All routes share navigation, footer and one geometric definition.

`scripts/prerender.mjs` renders all route text into HTML and creates distinct metadata. The deployment uses clean URLs and a real 404 page. There is no Product/Offer schema because the concept is not available for purchase.

## Art direction

Precision becomes visible through reflections, thin edges and measured separation. Graphite titanium and transparent optics are the subject; cyan is reserved for optical activity and selected state. Product and copy occupy separate regions. Technical and company sections introduce a pale drawing-table background. No copied Apple assets or proprietary code.

## Evidence and limits

The 3D object is a procedural design study, not a fabrication CAD model or evidence of a physical prototype. Nominal dimensions and all performance/price targets come from the supplied educational brief. Drawing dimensions are reference annotations, not fabrication tolerances. Screen scale varies with viewport and zoom. Simulation blur does not reproduce a clinical optical effect.

No analytics, personal-data collection, camera access, backend, forms or checkout are present. No runtime secrets are required.
