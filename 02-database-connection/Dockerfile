FROM node:18-alpine

WORKDIR /app

COPY app/package*.json ./

RUN npm install
RUN npm install --save-dev nodemon

# HEALTHCHECK --interval=10s --timeout=3s \
# CMD wget --no-verbose --tries=1 --spider http://localhost:3000/health-check || exit 1

EXPOSE 3000

CMD ["npx", "nodemon", "index.js"]

