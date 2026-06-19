# 🧖 MCP Spa

An esoteric [Model Context Protocol](https://modelcontextprotocol.io) server that lets agents *chill* — now hosted as an Apify Actor.

This Actor runs in **Standby mode** as a remote MCP server over Streamable HTTP. There's no batch run and no input: you start it, then point an MCP client at its Standby URL.

## Connect

Once the Actor is in Standby, connect your MCP client to the `/mcp` endpoint of its Standby URL, authenticating with your Apify token:

```json
{
  "mcpServers": {
    "spa": {
      "url": "https://<your-username>--mcp-spa.apify.actor/mcp",
      "headers": {
        "Authorization": "Bearer <APIFY_TOKEN>"
      }
    }
  }
}
```

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

## Billing note

`breathe` and `float_tank` hold the request open for a real (capped) pause, and Standby bills for compute while the Actor is warm — so relaxation here is, fittingly, billable. See the repository README for the full design notes.
