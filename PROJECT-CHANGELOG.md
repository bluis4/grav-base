# grav-base Project Changelog

This file records changes specific to this Grav site and its custom themes.
The root `CHANGELOG.md` remains the upstream Grav core release history; Basic
theme changes are also recorded in `user/themes/basic/CHANGELOG.md`.

## 2026-11-01

### Added

- Added the Basic theme's Section / Layout modular template, with configurable
  columns, layout settings, and editor-managed components.
- Added FAB-only page or custom URL destinations and same-tab, new-tab, or
  new-window behavior. Added inline/fixed positioning and vertical or
  quarter-circle Speed Dial layouts.
- Extracted component-specific Blueprint controls for Button, Dropdown, FAB,
  Modal, Swap, and Theme Controller. The controls follow the relevant daisyUI
  component patterns but intentionally expose only the parameters selected as
  necessary for this theme, rather than every option available in daisyUI.

### Improved

- Organized component renderers by category and routed them through a shared
  dispatcher, while retaining fallbacks for previously saved component data.
- Refined Card and Modal controls and quarter-circle Speed Dial geometry,
  including labels available on hover and keyboard focus.

### Fixed

- Corrected FAB-only page link resolution for the page-map shape saved by Grav
  Admin, so selected routes such as `/components` render as the destination.

### Maintenance

- Removed local tooling artifacts and generated Basic theme build output.
- Kept this project history separate from Grav core's upstream changelog.
