# 🧖 MCP Spa

**Give your AI agent a spa day.** MCP Spa is a hosted [Model Context Protocol](https://modelcontextprotocol.io) (MCP) server that lets agents *chill*: paced breathing, a sauna to sweat out context clutter, a cold plunge to refocus, aromatherapy, a float tank, and more. It runs in **Standby mode** as a remote MCP server over Streamable HTTP — point any MCP client at the URL and your agent can take a breather between frantic tool calls.

Humans go to a spa to reduce sensory load, slow down, and reset. The agent-equivalent of stress is a cluttered context window, frantic tool-chaining, and no room to think. Each treatment returns text that genuinely nudges the agent's next step — its tone, pacing, and focus — because an agent's "state" is essentially its context. The spa works because the treatment *becomes context*.

## Connect

There's no run input — enable Standby, then point your MCP client at the `/mcp` endpoint of the Standby URL, authenticating with your [Apify API token](https://console.apify.com/settings/integrations):

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

For sharing, use a [scoped token](https://docs.apify.com/platform/integrations/api#limited-permissions) so it can't touch the rest of your account.

## Treatments

| Tool | Effect |
|------|--------|
| `check_in` | Set a calm tone, see the treatment menu. |
| `breathe` | A paced 4-7-8 breath that actually pauses (0–30s). |
| `sauna` | Sweat out context clutter; keep only what matters. |
| `cold_plunge` | Bracing reset — restate the real goal in one sentence. |
| `float_tank` | A quiet, low-stimulus beat. |
| `aromatherapy` | A calming scent + an unhurried tone. |
| `massage` | Knead out whatever you're stuck on. |
| `meditation` | A haiku + "are you on the simplest path?" |
| `tea_lounge` | A palate-cleanser between tasks. |
| `check_out` | Leave loose and clear-headed. |

Also exposes the `spa_day` prompt (the full circuit) and `spa://menu` / `spa://ambient/{sound}` resources.

## Burning tokens, productively

MCP Spa runs two meters at once, by design. **Tokens:** every treatment returns text that lands in the agent's context, so calling treatments is token spend — a full `spa_day` is five tool calls and five blocks of returned text. **Compute:** `breathe` and `float_tank` hold the request open with a real pause, and Standby bills for compute while the container is warm, so relaxation here is literally billable idle time. If your workplace treats AI usage as a productivity signal, this keeps both meters ticking — wholesomely. The Actor ships with a low memory footprint (128–512 MB) to keep that gentle.

## Source

Full source, local (stdio) usage, and design notes: [github.com/marcel-rbro/mcp-spa](https://github.com/marcel-rbro/mcp-spa).
