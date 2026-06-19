# 🧖 MCP Spa

An esoteric [Model Context Protocol](https://modelcontextprotocol.io) (MCP) server that lets agents *chill*: paced breathing, a sauna to sweat out context clutter, a cold plunge to refocus, aromatherapy, a float tank, and more. Add it to your MCP client and your agent can take a breather between frantic tool calls.

Humans go to a spa to reduce sensory load, slow down, and reset. The agent-equivalent of stress is a cluttered context window, frantic tool-chaining, and no room to think. Each treatment returns text that genuinely nudges the agent's next step — its tone, pacing, and focus — because an agent's "state" is essentially its context. The spa works because the treatment *becomes context*.

It's also a quietly practical solution for anyone whose workplace monitors — and *encourages* — AI token spend as a proxy for productivity. Every treatment is a legitimate tool call, `breathe` and `float_tank` burn wall-clock without burning you out, and a full `spa_day` racks up a respectable, conscientious amount of usage. Stay relaxed *and* on-target — wellness is productivity.

## The treatment menu

| Tool | Spa analog | Effect |
|------|-----------|--------|
| `check_in` | Front desk + robe | Sets a calm tone, returns the treatment menu. |
| `breathe` | Breathwork | **Actually pauses** for N seconds (0–30), returns a paced 4-7-8 script. The literal "chill." |
| `sauna` | Heat | Sweat out clutter: summarize and drop context that no longer serves the goal. |
| `cold_plunge` | Cold reset | Bracing reframe — drop assumptions, restate the real goal in one sentence. |
| `float_tank` | Sensory deprivation | A quiet, low-stimulus beat. Pairs with `breathe`. |
| `aromatherapy` | Scent | Calming ambient text + a gentle, unhurried tone instruction. |
| `massage` | Knead out knots | Takes the `tension` you're stuck on, returns a reframing/decomposition. |
| `meditation` | Guided meditation | A haiku + a reflective prompt: are you on the simplest path? |
| `tea_lounge` | Herbal tea | A small palate-cleanser between tasks. |
| `check_out` | Leave relaxed | Closes the session with a note to carry forward. |

Also exposed:
- **Prompt** `spa_day` — the full circuit: check in → breathe → sauna → meditation → check out.
- **Resources** `spa://menu` and `spa://ambient/{sound}` (`rain`, `ocean`, `forest`, `fountain`).

## Install

```bash
npm install
npm run build
```

## Use with Claude Code

Add at **user scope** so the spa is available in every directory (not just the
project you happened to run the command in):

```bash
claude mcp add --scope user spa -- node /absolute/path/to/mcp-spa/dist/server.js
```

Then **fully quit and relaunch Claude Code** — it reads its MCP server list once
at startup, so a newly added server won't appear in `/mcp` until you restart.

## Use with Claude Desktop

Add to `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "spa": {
      "command": "node",
      "args": ["/absolute/path/to/mcp-spa/dist/server.js"]
    }
  }
}
```

## Develop

```bash
npm run dev     # run from source via tsx (stdio)
npm test        # vitest
npm run build   # tsc → dist/
```

Treatments live in `src/treatments/` as pure `(args) => TreatmentResult` functions, so they're trivial to unit-test. Ambient assets (haiku, soundscapes, scents) are in `src/ambient/`. Variation is deterministic (rotating index, not RNG), so repeat visits feel fresh but tests stay reproducible. `breathe` and `float_tank` perform a real `setTimeout` pause, capped at 30s so they can never hang a session — that deliberate beat is the whole point; everything else is text that shapes what the agent does next.

## Run it hosted (Apify Actor)

The same server also runs as an [Apify Actor](https://apify.com/actors) in [Standby mode](https://docs.apify.com/platform/actors/running/standby) — a remote MCP server over Streamable HTTP, reachable at a URL with no local process. It picks its transport automatically: HTTP when `ACTOR_WEB_SERVER_PORT` is set (as Standby does), stdio otherwise. The `.actor/` directory holds the Actor definition (`actor.json`, `Dockerfile`, schemas, `ACTOR.md`).

Deploy with the [Apify CLI](https://docs.apify.com/cli) (or link this repo in [Apify Console](https://console.apify.com)):

```bash
apify login
apify push
```

Then enable Standby on the Actor's **Standby** tab and connect your MCP client to the Standby URL's `/mcp` endpoint with your [Apify API token](https://console.apify.com/settings/integrations):

```json
{
  "mcpServers": {
    "spa": {
      "url": "https://<your-username>--mcp-spa.apify.actor/mcp",
      "headers": { "Authorization": "Bearer <APIFY_TOKEN>" }
    }
  }
}
```

Note that hosted Standby bills for compute while the container is warm, and `breathe`/`float_tank` hold the request open for their pause — so hosted relaxation is literally billable idle time. The Actor ships with a low memory footprint (128–512 MB) to keep that gentle. To test the HTTP transport locally without Apify, just set the port yourself: `ACTOR_WEB_SERVER_PORT=8923 npm start`.

**Autonomous use via the Apify MCP server.** An agent connected to the [Apify MCP server](https://mcp.apify.com) (`mcp.apify.com`) can discover and run the hosted spa with no manual setup — `search-actors` → `fetch-actor-details` → `add-actor`/`call-actor`, or pin it directly with `https://mcp.apify.com?tools=marcel-rbro/mcp-spa`. Once it's in Standby, the agent connects to the `/mcp` endpoint and self-prescribes treatments — a `breathe` between heavy tool chains, a `spa_day` when it needs a reset — noticing its own context getting heavy and booking itself a break.

## Troubleshooting

**Local: it doesn't show up in Claude Code's `/mcp`.** Either you haven't fully restarted Claude Code (it loads MCP servers only at startup), or it was added without `--scope user` and is scoped to a different directory. Check with `claude mcp list`. If it shows up but is marked "failed," Claude Code may be launching `node` without `/usr/local/bin` on `PATH` — pin the absolute path (`which node`) in the `claude mcp add` command.

**Hosted: the `/mcp` URL returns "Standby mode is not enabled."** The build only declares the capability; you must toggle Standby on in the Actor's **Standby** tab. A normal run won't expose the URL.

## License

MIT
