# Advent Calendar

A mobile-first Advent calendar web application built with Vue, TypeScript, and
Vite. Calendar content is stored in year-specific JSON files and the finished
site is deployable as a static application.

## Contents

- [Developer](#developer)
- [Project status](#project-status)

## Developer

### Install

```sh
npm install
```

### Local development

```sh
npm run dev
```

### Tests and quality checks

```sh
npm test
npm run lint
npm run format
npm run validate:content
```

### Production build

```sh
npm run build
```

## Repository setup

To prevent broken changes from being merged into `main`, configure a GitHub
branch protection rule or ruleset for `main` with these requirements:

- Require a pull request before merging.
- Require the `validate-and-build` status check to pass.
- Optionally require the branch to be up to date before merging.
- Optionally restrict direct pushes to `main`.

The workflow reports failures, but GitHub's branch protection configuration is
what enforces the merge restriction.

## Project status

The application foundation is in place. Calendar behaviour and content features
are implemented in the subsequent project tickets.
