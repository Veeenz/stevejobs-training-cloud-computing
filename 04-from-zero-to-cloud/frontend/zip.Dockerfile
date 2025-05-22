# Fase 1: build React/Vite
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Fase 2: zip in /tmp, poi copia in volume montato
FROM alpine:3.18 AS zipper

WORKDIR /zipper

RUN apk add --no-cache zip

COPY --from=builder /app/dist ./dist

# Zip in cartella temporanea
RUN cd dist && zip -r /tmp/vite-dist.zip .

# Output finale: /output/vite-dist.zip
CMD ["sh", "-c", "mkdir -p /output && cp /tmp/vite-dist.zip /output/ && echo '✅ ZIP salvato in /output/vite-dist.zip' && ls -lh /output && exit 0"]
