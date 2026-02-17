# Documentation Reference Updater Memory

## Project Structure
- Documentation files stored in `/docs/` directory (C:\Dev\liftingdiarycourse\docs\)
- All doc files use `.md` extension
- Current documentation files:
  - /docs/ui.md
  - /docs/data-fetching.md
  - /docs/auth.md
  - /docs/data-mutations.md
  - /docs/server-components.md
  - /docs/routing.md

## CLAUDE.md Reference List Location
- Section: "## IMPORTANT: Documentation-First Rule"
- Format: Bullet list with `- /docs/<filename>.md` entries
- Location: Lines 9-14 (as of last update)
- Order: Currently appending new entries at the end of the list

## Update Process
1. Glob for docs/**/*.md to find all documentation files
2. Read CLAUDE.md to locate the reference list
3. Compare files found in /docs against entries in CLAUDE.md
4. Append missing references at the end of the list (one per line)
5. Verify update by re-reading CLAUDE.md
6. Do NOT remove existing references even if files no longer exist
