FROM node:lts as base

WORKDIR /app

COPY package.json package-lock.json ./

FROM base as test
RUN npm ci
COPY . .
RUN npm run test

FROM base as prod
RUN npm ci --production && npm run build && npm prune --production
ENV PORT 5050
ENV ORIGIN http://0.0.0.0:5050
EXPOSE 5050
CMD ["node", "build"]