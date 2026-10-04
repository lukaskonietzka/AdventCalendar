# 08 — CI and GitHub Pages deployment behaviour

**What to build:** Verify the delivery workflow end to end for the configured
branch flow.

**Blocked by:** 02 — Calendar configuration and JSON validation; 03 — Calendar overview and date logic

**Status:** ready-for-agent

- [x] A push to `dev` uses a production-safe build with preview mode disabled.
- [x] JSON validation runs before the application build.
- [x] Deployment runs only after validation and build succeed.
- [x] A merged pull request from `dev` to `main` deploys the application to
      GitHub Pages.
