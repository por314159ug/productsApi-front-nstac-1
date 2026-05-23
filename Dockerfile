# Stage 1: Build the React application
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Serve the application using a static file server
FROM node:20-alpine
WORKDIR /app

# Copy built assets from the builder stage
COPY --from=builder /app/dist ./dist

# Copy package.json and package-lock.json to install 'serve'
COPY package*.json ./

# Install only production dependencies (which now includes 'serve')
RUN npm install --omit=dev

# Make sure the 'node' user can run the server and access 'dist'.
# OpenShift runs as an arbitrary UID in group 0.
# We give ownership to node user and root group, then make group-writable.
RUN chown -R node:0 /app && \
    chmod -R g+rwX /app

# Switch to a non-root user
USER node

# Expose port 8080 (as defined in the start script)
EXPOSE 8080

# Start the application using 'serve' via 'npm run start'
CMD ["npm", "run", "start"]
