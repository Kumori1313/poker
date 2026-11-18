# Poker

Play-money No-Limit Texas Hold’em for 2–6 players, with public or code-only rooms and shared Game Hub guest identities. Tables start with 1,000 chips per player, 10/20 blinds, and a 30-second turn clock. The host deals successive hands without recreating the room. Configurable settings follow in milestone 8.3.

## Development

Use Node 22.12+ and `npm ci`. Copy `.env.example` to `.env.local` and use the hub’s local Supabase URL and publishable key. Run `npm run dev` at `http://127.0.0.1:5175/poker/`, `npm test`, and `npm run build`. Never put private credentials in browser settings. The hub owns all SQL migrations.

Published path: https://kumori1313.github.io/poker/

## Shared contract

Room capacities and access are enforced by the backend. Hosting grants no private bypass for other rooms. Codes are shown only to admitted members, not placed in launch URLs. The backend owns shuffling, private cards, legal actions, deadlines, and payouts. Opponents’ cards appear only at showdown if they have not folded. Late joins and rebuys are disabled. Leaving folds unless already all-in; host ownership transfers automatically.

See the hub’s [room contract](https://github.com/Kumori1313/game-hub/blob/main/docs/shared-room-contract.md), [release runbook](https://github.com/Kumori1313/game-hub/blob/main/docs/release-runbook.md), and roadmap. Dark/light themes, guest entry, sticky browsing navigation, and shared auth storage follow the existing sites. Keep shared client files aligned until a versioned package replaces the copies.

See the [Hold’em contract and test coverage](https://github.com/Kumori1313/game-hub/blob/main/docs/poker-contract.md).
