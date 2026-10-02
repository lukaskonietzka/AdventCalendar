## Problem Statement

The user needs a reusable Advent calendar that can be opened one day at a time
on a mobile phone or desktop. Its contents should be easy to change between
calendar years and should not require a backend or database.

## Solution

Build a mobile-first Vue web application that is deployable to GitHub Pages and
can be saved as a home-screen link on a phone. Calendar contents are defined in year-specific JSON
configuration files. The application exposes 24 doors, controls availability
using the user's local device date, and stores all user progress in Local
Storage.

Each door contains an ordered list of activities. The first activity kinds are
text, image, riddle, and checklist. Door opening, activity completion, and
complete-door status are tracked independently. Local development includes a
preview mode for simulated dates; production builds must not include that
capability.

## User Stories

1. As a user, I want to view 24 Advent doors so that I can use the calendar
   throughout December.
2. As a user, I want only doors up to the current local date to be available so
   that future content remains locked.
3. As a user outside the Advent period, I want to see a countdown to the next
   1 December so that I know when the next calendar begins.
4. As a user, I want to navigate to previous years so that I can revisit older
   calendars and their doors.
5. As a user, I want to open an available door and see its ordered activities.
6. As a user, I want a door's state to be visibly distinguishable as locked,
   available, opened, or completed.
7. As a user, I want a door I have opened to remain viewable later so that I can
   revisit its contents.
8. As a user, I want a door to contain multiple activity types so that a day can
   combine text, images, riddles, and tasks.
9. As a user, I want to mark activities complete so that my progress is visible.
10. As a user, I want the application to remember opened doors and completed
   activities so that progress survives reloads and visits.
11. As a user, I want progress for different years to remain separate so that
   previous calendars are not lost.
12. As a user, I want to export my progress so that I can back it up.
13. As a user, I want to import progress and replace the current progress so
    that I can restore a backup without retaining stale local data.
14. As a content author, I want each year to have independent JSON content so
   that the same door can differ between years.
15. As a content author, I want to add, remove, or change doors and activities
   through configuration so that routine content changes do not require new
   application logic.
16. As a user, I want the application to remain usable when one door is missing
   or invalid so that one content error does not break the calendar.
17. As a user, I want to save the calendar link to my phone's home screen so
   that I can access it conveniently.
18. As a project owner, I want a merged pull request from `dev` to `main` to
    deploy automatically to GitHub Pages so that the published calendar stays
    up to date.

## Implementation Decisions

- Bootstrap the currently empty repository as a Vue 3 application using
  TypeScript and Vite before implementing calendar functionality.
- Add a project-appropriate `.gitignore` covering dependencies, build output,
  local environment files, and editor or operating-system artifacts.
- Always load content for the current calendar year.
- Make the current year the default while allowing navigation to previous
  configured years.
- Use Vue for a responsive, mobile-first static web application.
- Use JSON files as the content configuration boundary.
- Keep content year-specific while keeping the application implementation
  reusable across years.
- Model each door as an ordered collection of typed activities.
- Store user progress in Local Storage, partitioned by year.
- Use the local device timezone for availability checks.
- Provide a local-only preview mode for simulated dates.
- Build a responsive website that works on mobile and desktop and can be saved
  as a home-screen link.
- Use repository-local image assets rather than external image URLs.
- Treat errors at door level so that other doors remain available.
- Show a countdown to the next 1 December outside the Advent period.
- Display the countdown in whole days only.
- Represent doors with the visible states locked, available, opened, and
  completed.
- Show an unobtrusive notice that progress is stored locally and browser site
  data must not be cleared.
- Provide progress reset only in development mode.
- Replace existing progress when importing a progress export.
- Validate JSON syntax, door numbers, duplicate door numbers, required activity
  fields, and unknown activity types in CI. Do not validate image path
  existence initially.
- Run deployment only after validation and the application build succeed.
- Add a GitHub Actions workflow that deploys the application to GitHub Pages
  when a pull request from `dev` to `main` is merged.
- Ensure the pipeline disables preview mode for pushes to `dev` and for the
  production deployment. The branch configuration itself is maintained by the
  project owner and is not specified here.

## Testing Decisions

The implementation should verify externally observable behaviour at the unit,
component, and end-to-end levels where appropriate:

- date-based door availability in the local timezone;
- preview mode versus production behaviour;
- rendering each supported activity type and multiple activities in order;
- opening and completing activities and doors;
- year-separated Local Storage progress;
- export behaviour;
- malformed or missing door configuration isolation;
- Loading the responsive website from GitHub Pages with an internet connection.
- GitHub Actions deployment after merging a pull request from `dev` to `main`.
- Preview mode being disabled in the pipeline and production deployment.
- Countdown display outside the Advent period.
- Navigation to previous years and viewing historical doors.
- Door state styling for locked, available, opened, and completed states.
- Local-storage notice and resilient handling when browser site data is cleared.
- Development-only progress reset.
- Import replacing existing progress.
- CI failing for invalid JSON configuration.

The exact test tooling and detailed test fixtures remain to be established
during implementation because the repository currently contains no application
code or test setup.

## Out of Scope

- Backend or database persistence.
- User accounts and authentication.
- Cross-device synchronization.
- External image URLs.
- Automatic answer validation for riddles.
- More than 24 doors or a configurable calendar range.
- Defining or changing the repository's branch configuration and branch
  protection rules.
- PWA functionality, service-worker caching, and offline use.
- Accessibility-specific requirements.
- Timezone manipulation and other manual device-clock edge cases.
- Automatic generation of development test data.

## Initial Implementation Step

Create the basic Vue 3 and TypeScript project structure in the empty Git
repository, including the Vite development/build setup and the project's
initial test and quality-tooling foundation. Calendar features are implemented
after this foundation is available.

## Further Notes

- The exact JSON schema, runtime validation approach, and content authoring
  conventions still need to be specified.
- The exact export/import user interface remains to be specified.
- The first implementation should establish how the current year is derived
  and how the next 1 December is calculated, while intentionally leaving
  manual-clock and timezone manipulation edge cases untreated.
