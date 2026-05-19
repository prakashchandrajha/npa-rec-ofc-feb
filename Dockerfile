# Stage 1: Build Angular application
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies (including devDependencies needed for build)
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build -- --configuration production

# Stage 2: Serve with Nginx
FROM nginx:1.25-alpine

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built Angular app from builder stage
COPY --from=builder /app/dist/npa-rec-ofc-feb/browser/ /usr/share/nginx/html/

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
