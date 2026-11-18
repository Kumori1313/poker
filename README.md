# Poker

Play-money No-Limit Texas Hold’em for 2–6 players, with public or code-only rooms and shared Game Hub guest identities. Defaults are 1,000 chips per player, 10/20 blinds, and a 30-second turn clock. The host deals successive hands without recreating the room. Hosts can configure starting chips, blinds, turn time, capacity, and bounded rebuys before creating a room. Rules then lock for that room.

## Development

Use Node 22.12+ and `npm ci`. Copy `.env.example` to `.env.local` and use the hub’s local Supabase URL and publishable key. Run `npm run dev` at `http://127.0.0.1:5175/poker/`, `npm test`, and `npm run build`. Never put private credentials in browser settings. The hub owns all SQL migrations.

Published path: https://kumori1313.github.io/poker/

## Shared contract

Room capacities and access are enforced by the backend. Hosting grants no private bypass for other rooms. Codes are shown only to admitted members, not placed in launch URLs. The backend owns shuffling, private cards, legal actions, deadlines, and payouts. Opponents’ cards appear only at showdown if they have not folded. Late joins are disabled. Configured rebuys refill an empty stack only between hands; humans choose whether to rebuy, while bots rebuy automatically within the same limit. Leaving folds unless already all-in; host ownership transfers automatically.

See the hub’s [room contract](https://github.com/Kumori1313/game-hub/blob/main/docs/shared-room-contract.md), [release runbook](https://github.com/Kumori1313/game-hub/blob/main/docs/release-runbook.md), and roadmap. Dark/light themes, guest entry, sticky browsing navigation, and shared auth storage follow the existing sites. Keep shared client files aligned until a versioned package replaces the copies.

See the [Hold’em contract and test coverage](https://github.com/Kumori1313/game-hub/blob/main/docs/poker-contract.md).

## Bots

Create a lobby, choose its capacity, and select **Add bot** for each bot seat. Remove bots in the waiting room if you want to make space for a human. Start with one human and bots or mix several humans and bots, up to the selected six-seat maximum. Bot seats are fixed once play starts. Bots use a basic server-side strategy with their own cards and the public board; no paid AI service is involved. The hub's `npm run test:bots` covers solo/mixed tables and bot rules.

The hub’s `npm run test:settings` checks configured rules and audited rebuys. Saved room settings survive refresh and later hands; browser hosting preferences also persist when storage is available.
