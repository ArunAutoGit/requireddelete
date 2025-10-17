# Stage 1: Build the frontend app
FROM node:20-alpine AS build
WORKDIR /app

# Copy only package files first for efficient caching
COPY package*.json ./
RUN npm install

# Copy rest of the project files
COPY . .

# Build the app (Vite build)
RUN npm run build

# Stage 2: Serve the built app using NGINX
FROM nginx:stable-alpine
COPY --from=build /app/dist /usr/share/nginx/html

# Expose the port for container
EXPOSE 80

# Start NGINX
CMD ["nginx", "-g", "daemon off;"]
