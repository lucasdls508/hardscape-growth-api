FROM node:20-alpine

WORKDIR /app

# Install production deps from lockfile
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# Copy pre-built dist and runtime files
COPY dist/ ./dist/
COPY boot.js ./

EXPOSE 8080

CMD ["node", "boot.js"]
