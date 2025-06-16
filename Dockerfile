############################
# 1. Build stage
############################
FROM node:20-alpine AS builder

WORKDIR /app

# install only production deps ― lock‑file mismatch tolerated
COPY package*.json ./
RUN npm install --omit=dev --no-audit --no-fund

# copy source and build
COPY . .
RUN npm run build   # → dist/

############################
# 2. Runtime stage
############################
FROM nginx:1.25-alpine

# SPA‑friendly config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Static files
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80
HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
  CMD wget -qO- http://localhost || exit 1

CMD ["nginx", "-g", "daemon off;"]
