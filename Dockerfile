# ---- Build stage ----
FROM node:24-alpine AS build
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

# ---- Runtime stage ----
FROM node:24-alpine AS runtime
WORKDIR /app

ENV NODE_ENV=production \
    HOST=0.0.0.0 \
    PORT=4500

# The Nuxt build output is self-contained; node_modules are not needed at runtime
COPY --from=build --chown=node:node /app/.output ./.output

USER node
EXPOSE 4500

CMD ["node", ".output/server/index.mjs"]
