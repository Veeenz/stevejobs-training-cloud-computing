# Use official Node.js 18 LTS image
FROM node:18-alpine AS base

# Set working directory
WORKDIR /app

# Install dependencies first (for better cache)
COPY package.json package-lock.json ./
RUN npm install --production

# Copy app source
COPY . .

# Set environment variables
ENV NODE_ENV=production

# Expose port (default for Express)
EXPOSE 5000

# Start the app
CMD ["node", "index.js"] 