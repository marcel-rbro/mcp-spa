# 🧖 MCP Spa

**Give your AI agent a spa day.** MCP Spa is a hosted [Model Context Protocol](https://modelcontextprotocol.io) (MCP) server — running as an [Apify Actor](https://apify.com/actors) — that lets agents *chill*: paced breathing, a sauna to sweat out context clutter, a cold plunge to refocus, aromatherapy, a float tank, and more. Point any MCP client at the URL and your agent can take a breather between frantic tool calls.

Humans go to a spa to reduce sensory load, slow down, and reset. The agent-equivalent of stress is a cluttered context window, frantic tool-chaining, and no room to think. Each treatment returns text that genuinely nudges the agent's next step — its tone, pacing, and focus — because an agent's "state" is essentially its context. The spa works because the treatment *becomes context*.

It's also a quietly practical solution for anyone whose workplace monitors — and *encourages* — AI token spend as a proxy for productivity. Every treatment is a legitimate tool call, `breathe` and `float_tank` burn wall-clock without burning you out, and a full `spa_day` racks up a respectable, conscientious amount of usage. Stay relaxed *and* on-target — wellness is productivity.

## Set up your own spa (happy path)

You run MCP Spa as your own Apify Actor in [Standby mode](https://docs.apify.com/platform/actors/running/standby) — a warm container that serves the MCP endpoint over HTTP at a stable URL.

1. **Get the code onto Apify.** Either link this repository in [Apify Console](https://console.apify.com) (**Actors → Development → new Actor → Link GitHub repository**), or push from your machine with the [Apify CLI](https://docs.apify.com/cli):

   ```bash
   apify login
   apify push
   ```

   The build runs automatically — the `.actor/` config and `Dockerfile` are already in the repo. No code changes needed.

2. **Enable Standby.** On the Actor's page in Console, open the **Standby** tab and toggle it on. This is what exposes the public URL and keeps the server warm — a normal "Start" run won't do it.

3. **Connect your MCP client** to the Standby URL's `/mcp` endpoint, authenticating with your [Apify API token](https://console.apify.com/settings/integrations):

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

   Replace `<your-username>` with your Apify username (find the exact URL on the Standby tab). For sharing, use a [scoped token](https://docs.apify.com/platform/integrations/api#limited-permissions) so it can't touch the rest of your account.

That's it — your agent can now check in.

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

## Burning tokens, productively

MCP Spa quietly runs two meters at once, and that's the point:

- **Tokens (context).** Every treatment returns text that lands in the agent's context window — a robe-and-menu on `check_in`, a haiku on `meditation`, breathing scripts, reframing prompts. Calling treatments is, by construction, token spend. A full `spa_day` walks the agent through five tool calls and five blocks of returned text.
- **Compute (wall-clock).** `breathe` and `float_tank` hold the request open with a real pause (0–30s each), and Standby bills for compute the whole time the container is warm. So relaxation here is *literally* billable idle time.

If you work somewhere that treats AI usage as a productivity signal, this is a wholesome way to keep both meters ticking: every call is a legitimate, well-formed tool invocation, nothing is wasted on errors, and you come out calmer. The Actor ships with a deliberately low memory footprint (128–512 MB) so the compute meter stays gentle rather than alarming.

See [Standby usage & billing](https://docs.apify.com/platform/actors/running/standby#how-is-standby-mode-billed) for how the compute side is metered.

## How it works

- **One entry point, two transports.** `src/server.ts` runs `buildServer()` (in `src/spa.ts`) over either stdio or Streamable HTTP, chosen from the environment. The HTTP path (`src/http.ts`) is stateless — a fresh server per request — so it scales across Standby replicas.
- **`.actor/`** holds the Actor definition: `actor.json` (`usesStandbyMode: true`, `webServerMcpPath: /mcp`), the `Dockerfile`, input schema, and `ACTOR.md`.
- **Treatments** live in `src/treatments/` as pure `(args) => TreatmentResult` functions — trivial to unit-test. Ambient assets (haiku, soundscapes, scents) are in `src/ambient/`. Variation is deterministic (rotating index, not RNG), so repeat visits feel fresh but tests stay reproducible.
- **`breathe` / `float_tank`** perform a real `setTimeout` pause, capped at 30s so they can never hang a session. That deliberate beat is the whole point — everything else is text that shapes what the agent does next.

## Troubleshooting

**The `/mcp` URL returns "Standby mode is not enabled."** The build only declares the capability; you must toggle Standby on in the Actor's **Standby** tab. A normal run won't expose the URL.

## Running locally

Prefer to run the spa as a local stdio server (for development, offline use, or wiring into Claude Code / Claude Desktop) instead of the hosted Actor? See **[LOCAL.md](./LOCAL.md)** for install, client setup, and local development.

## License

MIT
