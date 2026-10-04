# 05a — Door interaction and mobile modal UX

**What to build:** Improve the interaction feedback for calendar doors and show
opened content in a mobile-friendly modal instead of placing it below the
calendar grid.

**Blocked by:** 05 — Progress persistence and door states

**Status:** ready-for-agent

- [ ] Every door provides a visible hover and keyboard-focus effect that
      highlights the individual element.
- [ ] Available doors receive a subtle zoom or lift effect on hover/focus.
- [ ] Locked doors communicate their unavailable state without using the vague
      label `Locked` as the only explanation.
- [ ] Available doors use a clear, user-oriented status or visual treatment
      instead of the generic label `Available`.
- [ ] Opening a door displays its activities in a modal rather than below the
      calendar grid.
- [ ] The modal is designed mobile-first, remains usable on desktop, and can be
      closed with a visible control.
- [ ] Keyboard focus remains usable when the modal is open and after it closes.
