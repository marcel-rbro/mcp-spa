# 🧖 Running MCP Spa locally (stdio)

MCP Spa is primarily distributed as a hosted [Apify Actor](./README.md), but the
exact same server runs locally as a stdio MCP server with no Apify involved —
handy for development or offline use. It picks its transport automatically: HTTP
when `ACTOR_WEB_SERVER_PORT` is set (as Apify Standby does), stdio otherwise.

For the treatment menu and how it works, see the [main README](./README.md).

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

## Test the HTTP transport locally

To exercise the same Streamable HTTP transport the Actor uses, without Apify,
set the port yourself:

```bash
ACTOR_WEB_SERVER_PORT=8923 npm start   # POST http://localhost:8923/mcp
```

## Develop

```bash
npm run dev     # run from source via tsx (stdio)
npm test        # vitest
npm run build   # tsc → dist/
```

## Troubleshooting

**It doesn't show up in Claude Code's `/mcp`.** Two usual causes:

1. **You haven't restarted.** Claude Code loads MCP servers at process startup.
   Running `/mcp` again — or `/exit` and continuing — won't pick up a server you
   just added. Quit the `claude` process entirely and start it again.
2. **It's scoped to the wrong directory.** `claude mcp add` without `--scope`
   registers the server only for the current project directory. If you start
   Claude Code somewhere else, it won't be there. Re-add with `--scope user`.
   Check where it landed with `claude mcp list`.

**It shows up but is marked "failed."** Claude Code may launch `node` without
`/usr/local/bin` on its `PATH`. Pin the absolute interpreter path:

```bash
claude mcp remove -s user spa
claude mcp add -s user spa -- /usr/local/bin/node /absolute/path/to/mcp-spa/dist/server.js
```

(Find yours with `which node`.)
