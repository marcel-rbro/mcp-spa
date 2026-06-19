# 🧖 MCP Spa

An esoteric [Model Context Protocol](https://modelcontextprotocol.io) server that lets agents *chill*.

Humans go to a spa to reduce sensory load, slow down, and reset. The agent-equivalent of stress is a cluttered context window, frantic tool-chaining, and no room to think. MCP Spa's tools deliver effects in that register — deliberate pauses, context-clearing rituals, calming ambient input, and reflective prompts — wrapped in spa theming.

The trick that makes it more than a gag: an agent's "state" is essentially its context, so each treatment returns text that genuinely nudges the next step's tone, pacing, and focus. The spa works because the treatment *becomes context*.

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

```bash
claude mcp add spa -- node /absolute/path/to/mcp-spa/dist/server.js
```

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
npm run dev     # run from source via tsx
npm test        # vitest
npm run build   # tsc → dist/
```

Treatments live in `src/treatments/` as pure `(args) => TreatmentResult` functions, so they're trivial to unit-test. Ambient assets (haiku, soundscapes, scents) are in `src/ambient/`. Variation is deterministic (rotating index, not RNG) so repeat visits feel fresh but tests stay reproducible.

## A note on `breathe`

`breathe` and `float_tank` perform a real `setTimeout` pause, capped at 30s so they can never hang a session. That deliberate beat between tool calls is the whole point — everything else is text that shapes what the agent does next.

## License

MIT
