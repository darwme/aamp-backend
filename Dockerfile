FROM node:20-alpine

WORKDIR /usr/src/app

# Copy package files first (for better caching)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the TypeScript code
RUN npm run build

# Verify the build output exists
RUN ls -la dist || echo "dist directory not found"

# Expose the auth service port
EXPOSE 3001

# Define the command to run your application
CMD ["node", "dist/app.js"]
