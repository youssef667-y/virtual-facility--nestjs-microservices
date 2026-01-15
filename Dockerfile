# Use Node 20 for NestJS 11+
FROM node:20-alpine

# ARG for the service name
ARG APP_NAME

# Set working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json first
COPY package*.json ./

# Install dependencies
RUN npm install --frozen-lockfile

# Copy all files
COPY . .

# Build only the specific app
RUN npm run build -- $APP_NAME

# Run the specific app
CMD ["node", "dist/apps/${APP_NAME}/main.js"]
