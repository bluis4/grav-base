# v0.1.0
##  10/18/2026

1. [](#new)
    * ChangeLog started...

# v0.1.1
## 11/01/2026

1. [](#bugfix)
    * Fixed page selection for FAB-only links: selected page routes are now read from the same `page` map shape saved by Grav Admin, so choosing a page such as `/components` produces the expected FAB destination.

# v0.1.2
## 11/01/2026

1. [](#new)
    * Added the Section / Layout modular page template with configurable columns, layout and alignment controls, spacing/background settings, and support for editor-managed components.
    * Added FAB-only link destinations (Grav page or custom URL) and configurable same-tab, new-tab, and new-window behavior.
    * Added a FAB position control for inline-in-column or fixed placement, plus vertical and quarter-circle Speed Dial layouts.
    * Added component-specific Blueprint fields for Text, Button, Dropdown, FAB, Modal, Swap, Theme Controller, Badge, and Card, replacing generic fields where those components were extracted.

2. [](#improvement)
    * Organized component renderers by category and routed component rendering through the shared dispatcher; updated the component library to use the current component data shape.
    * Refined Card and Modal controls and quarter-circle FAB sizing/labels. Speed Dial labels are available on hover and keyboard focus.
    * Preserved compatibility with previously saved component values through dispatcher fallbacks.

3. [](#bugfix)
    * Fixed FAB-only page selection to read the page map saved by Grav Admin, so selected routes such as `/components` render as the destination.

4. [](#maintenance)
    * Removed local tooling artifacts `.freebuff/`, `.zwork/`, `.clinerules`, and generated `user/themes/basic/tmpbuild/` files. `.codex-remote-attachments/` was retained.
    * The project handover is now a static historical reference; future project updates are recorded in this changelog.
