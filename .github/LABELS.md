# 🏷️ GitHub Labels Guide

This document describes the labels used in the Connectrix repository and how to set them up.

## Required Labels for Hacktoberfest

### For Maintainers: Setting Up Labels

To create these labels in your repository:

1. Go to your repository on GitHub
2. Click on "Issues" tab
3. Click "Labels" button
4. Click "New label" for each label below

Alternatively, you can use the GitHub CLI:

```bash
gh label create "good first issue" --description "Good for newcomers" --color "7057ff"
gh label create "help wanted" --description "Extra attention is needed" --color "008672"
gh label create "documentation" --description "Improvements or additions to documentation" --color "0075ca"
gh label create "priority:low" --description "Low priority issue" --color "d4c5f9"
gh label create "hacktoberfest" --description "Hacktoberfest eligible" --color "ff6b35"
gh label create "hacktoberfest-accepted" --description "PR accepted for Hacktoberfest" --color "2e8b57"
```

## Label Definitions

### Core Labels

| Label | Color | Description | When to Use |
|-------|-------|-------------|-------------|
| `good first issue` | `#7057ff` | Good for newcomers | Simple, self-contained issues perfect for first-time contributors |
| `help wanted` | `#008672` | Extra attention is needed | Issues where maintainers actively seek community help |
| `documentation` | `#0075ca` | Improvements or additions to documentation | Any documentation-related work (README, code comments, guides) |
| `hacktoberfest` | `#ff6b35` | Hacktoberfest eligible | Issues specifically prepared for Hacktoberfest participants |
| `hacktoberfest-accepted` | `#2e8b57` | PR accepted for Hacktoberfest | PRs that meet quality standards and count toward Hacktoberfest |

### Priority Labels

| Label | Color | Description | When to Use |
|-------|-------|-------------|-------------|
| `priority:low` | `#d4c5f9` | Low priority | Nice-to-have improvements, non-critical bugs |
| `priority:medium` | `#fbca04` | Medium priority | Important but not urgent issues |
| `priority:high` | `#d93f0b` | High priority | Critical bugs, security issues, blocking problems |

### Type Labels

| Label | Color | Description | When to Use |
|-------|-------|-------------|-------------|
| `bug` | `#d73a4a` | Something isn't working | Confirmed bugs that need fixing |
| `enhancement` | `#a2eeef` | New feature or request | Feature requests and improvements |
| `ui/ux` | `#c5def5` | UI/UX improvements | Interface design and user experience work |
| `accessibility` | `#cfd3d7` | Accessibility improvements | Making the platform more accessible |
| `testing` | `#bfdadc` | Related to testing | Test creation, improvement, or fixes |
| `refactor` | `#fef2c0` | Code refactoring | Code improvements without changing functionality |
| `security` | `#ee0701` | Security-related | Security vulnerabilities or improvements |

### Status Labels

| Label | Color | Description | When to Use |
|-------|-------|-------------|-------------|
| `wontfix` | `#ffffff` | This will not be worked on | Issues that won't be addressed |
| `duplicate` | `#cfd3d7` | This issue already exists | Duplicate of existing issue |
| `invalid` | `#e4e669` | This doesn't seem right | Invalid or unclear issues |
| `question` | `#d876e3` | Further information is requested | Questions needing clarification |
| `blocked` | `#d93f0b` | Blocked by dependencies | Cannot proceed until dependencies are resolved |
| `in progress` | `#0e8a16` | Work in progress | Someone is actively working on this |
| `needs review` | `#fbca04` | Needs review | PR ready for maintainer review |

## Label Usage Guidelines

### Applying Multiple Labels

Issues can have multiple labels. Common combinations:

- `good first issue` + `documentation` + `priority:low`
- `bug` + `help wanted` + `priority:high`
- `enhancement` + `hacktoberfest` + `good first issue`

### Hacktoberfest-Specific Guidelines

#### Issues
- Apply `hacktoberfest` to issues you want Hacktoberfest participants to work on
- Combine with `good first issue` for beginner-friendly Hacktoberfest issues
- Ensure issues have clear descriptions and acceptance criteria

#### Pull Requests
- Add `hacktoberfest-accepted` to quality PRs that meet our standards
- Only apply to PRs that are meaningful and valuable
- Remove if PR quality doesn't meet standards (spam, trivial changes)

### Best Practices

1. **Be Specific**: Use multiple labels to clearly categorize issues
2. **Update Regularly**: Add/remove labels as issue status changes
3. **Consistent Application**: Follow these guidelines consistently
4. **Clear Communication**: Labels help contributors find suitable issues

## Setting Repository Topics

In addition to labels, add these topics to your repository:

1. Go to your repository on GitHub
2. Click the gear icon ⚙️ next to "About" on the right sidebar
3. Add these topics:
   - `hacktoberfest`
   - `nextjs`
   - `typescript`
   - `mongodb`
   - `university`
   - `club-management`
   - `student-platform`
   - `good-first-issue`

Topics help people discover your repository and are especially important for Hacktoberfest participation.

## Automation Tips (Optional)

Consider setting up GitHub Actions to:
- Auto-label PRs based on files changed
- Auto-label issues based on templates used
- Auto-add `hacktoberfest-accepted` to approved PRs during October

Example workflow can be added later if needed.

---

**Questions?** Open an issue or discussion if you need help with labels!
