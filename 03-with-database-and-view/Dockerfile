FROM node:18-alpine

WORKDIR /app

COPY app/package*.json ./
RUN npm install
RUN npm install --save-dev nodemon

COPY app/index.js ./index.js
COPY app/views ./views
COPY app/public ./public

HEALTHCHECK --interval=30s --timeout=3s \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/health-check || exit 1

EXPOSE 3000

CMD ["npx", "nodemon", "index.js"]


