# Stage 1: Build the application
FROM node:18 AS build

# Set working directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy the source code
COPY . .

# Build the TypeScript code
RUN npm run build

# Stage 2: Create a production image
FROM node:18-slim

# Set working directory
WORKDIR /app

# Copy the built files from the build stage
COPY --from=build /app .

# Install only production dependencies
COPY package*.json ./
RUN npm install --production

# Copy the .env file for the app
COPY .env .env

# Expose the port the app will run on
EXPOSE 8080

# Start the application
CMD ["npm", "start"]
