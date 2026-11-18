# Poker

Game Hub’s poker lobby preview. Guests can create public or code-only rooms for 2–6 players and share the hub identity. Dealing, betting, and playable hands arrive in milestone 8.2; this preview does not start a poker game.

## Development

Use Node 22.12+ and `npm ci`. Copy `.env.example` to `.env.local` and use the hub’s local Supabase URL and publishable key. Run `npm run dev` at `http://127.0.0.1:5175/poker/`, `npm test`, and `npm run build`. Never put private credentials in browser settings. The hub owns all SQL migrations.

Published path: https://kumori1313.github.io/poker/

## Shared contract

Room capacities and access are enforced by the backend. Hosting grants no private bypass for other rooms. Codes are shown only to admitted members, not placed in launch URLs. The future Hold’em implementation must keep the deck and private cards server-side.

See the hub’s [room contract](https://github.com/Kumori1313/game-hub/blob/main/docs/shared-room-contract.md), [release runbook](https://github.com/Kumori1313/game-hub/blob/main/docs/release-runbook.md), and roadmap. Dark/light themes, guest entry, sticky browsing navigation, and shared auth storage follow the existing sites. Keep shared client files aligned until a versioned package replaces the copies.
