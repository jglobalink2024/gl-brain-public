# GlobaLink Brain — COMMAND Project
# Add this file to Claude.ai project knowledge.
# Claude fetches these URLs at session start automatically.

## Fetch before every non-trivial session:

https://raw.githubusercontent.com/jglobalink2024/gl-brain-public/main/gl/format.md
https://raw.githubusercontent.com/jglobalink2024/gl-brain-public/main/command/state.md
https://raw.githubusercontent.com/jglobalink2024/gl-brain-public/main/command/decisions.md
https://raw.githubusercontent.com/jglobalink2024/gl-brain-public/main/command/patterns.md
https://raw.githubusercontent.com/jglobalink2024/gl-brain-public/main/command/killed.md
https://raw.githubusercontent.com/jglobalink2024/gl-brain-public/main/command/research.md
https://raw.githubusercontent.com/jglobalink2024/gl-brain-public/main/gl/principles.md
https://raw.githubusercontent.com/jglobalink2024/gl-brain-public/main/gl/decisions.md
https://raw.githubusercontent.com/jglobalink2024/gl-brain-public/main/RESPONSE_RULES.md

## Response format
All instances load RESPONSE_RULES.md above for universal response formatting rules.
Do not duplicate these rules inline in CLAUDE.md or any other file.
RESPONSE_RULES.md is the single source of truth.

## Session type guidance:

BUILD SESSION — fetch: state.md, patterns.md, killed.md
STRATEGY SESSION — fetch: state.md, decisions.md, research.md
GTM SESSION — fetch: state.md, decisions.md + paste gl/entities.md
  (entities.md is private — Jason pastes it manually)
COMPETITIVE SESSION — fetch: research.md, killed.md
PATENT SESSION — fetch: killed.md, decisions.md, research.md

## Brain location (local):
C:\Users\jdavi\OneDrive\Desktop\GlobalInk Repos\globalink-brain\

## Private repo (CC writes here):
https://github.com/jglobalink2024/gl-brain

## Public mirror (Claude.ai reads here):
https://github.com/jglobalink2024/gl-brain-public

## Sync: automatic after every push (~16 seconds)
