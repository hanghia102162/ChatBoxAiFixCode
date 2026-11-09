# Design QA — Chat interface

**Source visual truth:** User-provided desktop screenshot in this conversation (800 × 600).

**Implementation target:** `src/modules/chat/View/ChatView.vue` and child components.

**Viewport and state:** Intended desktop dark-mode chat interface. The implementation uses a 256 px fixed sidebar and responsive chat content. Default conversation state shown.

**Implementation screenshot:** Not available.

## Findings

- [P1] Browser-rendered visual comparison is unavailable.
  Location: local preview / visual QA.
  Evidence: Vite started successfully outside the sandbox, but this session has no available browser surface for capturing the rendered page. The provided reference is available only as the conversation image, so a same-viewport screenshot comparison cannot be performed.
  Impact: Layout, typography, colour, icon scale, and spacing cannot be visually signed off against the reference.
  Fix: Open the local Vite preview in a browser, capture the desktop state at 800 × 600, then compare it alongside the provided reference and address any P0–P2 differences.

## Required fidelity surfaces

- **Fonts and typography:** Implemented with the system UI stack, compact 9–12 px UI type, monospaced code, and dense hierarchy matching the source; not browser-verified.
- **Spacing and layout rhythm:** Implemented with a 256 px sidebar, centered 4xl conversation column, compact cards, and fixed composer placement; not browser-verified.
- **Colors and visual tokens:** Uses dark shadcn-compatible semantic tokens plus Python syntax colours; not browser-verified.
- **Image quality and asset fidelity:** No raster imagery exists in the reference. Interface icons use `lucide-vue-next`; no handcrafted SVG or placeholder imagery was introduced.
- **Copy and content:** Vietnamese developer-chat content and prime-number Python example are implemented.

## Open questions

- The source screenshot does not provide hover, focus, mobile, or menu-open states; the implementation supplies standard shadcn-like states for these controls.

## Implementation checklist

1. Capture the implementation at 800 × 600 in a browser.
2. Compare full view and code-panel/sidebar focused regions with the source image.
3. Adjust any actionable P0–P2 visual differences.

## Comparison history

- No visual comparison iteration could run because a browser-rendered implementation capture is unavailable.

**final result: blocked**
