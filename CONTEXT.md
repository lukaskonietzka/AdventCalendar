# Advent Calendar Context

## Purpose

The project is a mobile-first Advent calendar web application that can be used
on a phone and desktop and saved as a home-screen link. It is deployed as a
static application through GitHub Pages and requires an internet connection.

The repository currently contains no application code. The first implementation
step is to bootstrap a Vue 3 project with TypeScript and Vite.

The repository must include a project-appropriate `.gitignore` before regular
development begins. It must exclude dependencies, build output, local
environment files, and editor or operating-system artifacts.

The visual direction is modern and mobile-first, using Advent-inspired colours,
pastel tones, tasteful Advent icons, and contemporary UI components.

## Domain glossary

- **Calendar year**: The year for which a complete set of Advent door contents
  is configured, for example 2026 or 2027.
- **Door**: One of the 24 calendar entries, numbered from 1 through 24. A door
  becomes available according to its Advent date in the user's local device
  timezone.
- **Activity**: One content element within a door. The first supported kinds
  are text, image, riddle, and checklist.
- **Door opened**: The user has opened a door. This is tracked separately from
  completion.
- **Activity completed**: The user has explicitly or automatically completed a
  single activity, depending on the activity's behaviour.
- **Door completed**: All activities in the door are completed.
- **Preview mode**: A local-development-only mode that allows future dates to
  be simulated for testing. It must be disabled in production builds.
- **Local asset**: An image stored in the repository and referenced by the
  content configuration; external image URLs are not supported initially.

## Content model decisions

- The calendar always has 24 doors, from 1 December through 24 December.
- The calendar year is configurable and reusable across years.
- The application automatically loads the current calendar year by default.
- Users can navigate to previous years and view their historical doors and
  progress.
- Door content is year-specific: door 1 in 2026 may differ from door 1 in
  2027.
- A door contains an ordered list of one or more activities.
- The initial activity kinds are text, image, riddle, and checklist.
- Riddles display a question and an optional solution. They do not validate
  answers; the user completes them manually.
- Images use repository-local assets only.
- A malformed or missing door must show a comprehensible error for that door
  without preventing other doors from working.

## Progress model decisions

- Progress is stored only in Local Storage.
- The interface shows a small, unobtrusive notice explaining that progress is
  stored locally and browser data or site storage must not be cleared.
- Progress is separated by calendar year and remains available for previous
  years.
- The application tracks when a door was opened, completion of individual
  activities, and completion of the complete door.
- A door is complete when all of its activities are complete.
- Doors have four visible states: locked, available, opened, and completed.
- Once opened, a door remains available for viewing later, including when the
  user navigates through historical years.
- Progress can be exported as versioned JSON. Import is a corresponding
  capability for restoring an export on another device and replaces the
  current progress.
- Development mode provides a progress reset function for testing.

## Date and runtime decisions

- Availability uses the local timezone of the device.
- A door is available when the local date has reached its Advent day.
- Outside the Advent period, the application shows a countdown to the next 1
  December using days only.
- Preview mode is available only for local development and is automatically
  excluded from production builds and GitHub Pages deployments.
- The application is a normal responsive website, not a PWA.
- Offline use, service-worker caching, and PWA update management are not part
  of the scope.

## Configuration and deployment

- Calendar content is configured through JSON files rather than a database or
  backend.
- The application and content are statically deployable to GitHub Pages.
- The GitHub Actions CI workflow validates all JSON content and fails when
  validation finds an error.
- CI validates JSON syntax, door numbers, duplicate door numbers, required
  activity fields, and unknown activity types. Image path existence is not
  validated initially.
- Deployment runs only after validation and the application build succeed.
- A GitHub Actions workflow must deploy the application to GitHub Pages when a
  pull request from `dev` to `main` is merged.
- The pipeline must ensure that preview mode is disabled for pushes to `dev`
  and for production deployments. Branch setup and repository-specific branch
  protection remain outside this initiative's specification.
- No user account, server-side persistence, or cross-device synchronization is
  part of the initial scope.

## Open points

- The exact JSON schema and validation strategy remain to be specified.
- The exact export/import user interface remains to be specified; importing
  replaces the current progress.
- Generation and maintenance of development test data remain follow-up work.
