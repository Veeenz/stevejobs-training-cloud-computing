FROM node:18-alpine

WORKDIR /app

COPY app/package*.json ./
COPY app/index.js ./


RUN npm install
RUN npm install --save-dev nodemon

EXPOSE 3000

CMD ["npx", "nodemon", "index.js"]


