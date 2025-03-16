# Stage de build
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Stage de production
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production
RUN npm install -g @nestjs/cli

COPY . .
COPY --from=builder /app/dist ./dist

EXPOSE 3000
CMD ["npm", "run", "start:dev"] 