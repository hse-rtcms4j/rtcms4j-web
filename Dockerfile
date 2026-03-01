# build stage (unchanged)
FROM node:24-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

RUN npm run build

# runtime stage (modified)
FROM node:24-alpine

WORKDIR /app

RUN npm install -g serve

COPY --from=build /app/dist /app/dist

COPY --from=build /app/dist/vite-envs.sh /app/dist/vite-envs.sh
RUN chmod +x /app/dist/vite-envs.sh

EXPOSE 3000

ENTRYPOINT sh -c "cd /app/dist && ./vite-envs.sh && serve -s . -l 3000"
