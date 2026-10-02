# 02 — Calendar configuration and JSON validation

**What to build:** Define the year-specific calendar content model and validate
content before it can be deployed.

**Blocked by:** 01 — Vue project foundation and delivery pipeline

**Status:** ready-for-agent

- [ ] Year-specific configuration supports 24 doors and ordered activities.
- [ ] Text, image, riddle, and checklist activities are represented.
- [ ] CI rejects invalid JSON, invalid or duplicate door numbers, missing
      required activity fields, and unknown activity types.
- [ ] Image path existence is not required to pass validation.
