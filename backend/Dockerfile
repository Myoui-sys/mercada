FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY package*.json ./
RUN npm install --omit=dev
COPY --from=build /app/dist ./dist
COPY docker-entrypoint.sh ./docker-entrypoint.sh
RUN mkdir -p /app/data && chmod +x ./docker-entrypoint.sh
EXPOSE 3001
ENTRYPOINT ["./docker-entrypoint.sh"]
