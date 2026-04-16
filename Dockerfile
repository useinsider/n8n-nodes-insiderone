FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM n8nio/n8n:2.16.1
COPY --from=builder /app/dist /home/node/.n8n/custom/node_modules/n8n-nodes-insiderone/dist
COPY --from=builder /app/package.json /home/node/.n8n/custom/node_modules/n8n-nodes-insiderone/package.json
