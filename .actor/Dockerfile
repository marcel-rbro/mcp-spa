# Apify Node.js base image. The build compiles TypeScript to dist/; at runtime
# the Actor starts in Standby mode and serves Streamable HTTP on the port given
# by ACTOR_WEB_SERVER_PORT.
FROM apify/actor-node:20

# Install dependencies first to leverage Docker layer caching.
# --ignore-scripts: skip the `prepare` script (it runs `npm run build`, but the
# source isn't copied yet — the explicit build below handles compilation).
COPY package*.json ./
RUN npm ci --include=dev --ignore-scripts \
    && echo "Installed npm packages:" \
    && (npm list --omit=dev --all || true)

# Copy the rest of the source and build.
COPY . ./
RUN npm run build \
    && npm prune --omit=dev

# Standby mode hits the web server the Actor starts; server.ts picks the HTTP
# transport when ACTOR_WEB_SERVER_PORT is set.
CMD ["node", "dist/server.js"]
