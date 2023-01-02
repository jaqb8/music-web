FROM node:current-alpine3.17 AS base
RUN apk add g++ make py3-pip
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run check && npm run build && npm prune --production

FROM node:current-alpine3.17
USER node:node
WORKDIR /app
COPY --from=base --chown=node:node /app/build ./build
COPY --from=base --chown=node:node /app/node_modules ./node_modules
COPY --chown=node:node package.json .
ENV ORIGIN http://0.0.0.0:5050
ENV PORT 5050
EXPOSE 5050
CMD ["node", "-r", "dotenv/config", "build"]