# Use the official Node.js 14 image as base
FROM node:20

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy the rest of the application code
COPY . .

# Build the React app
RUN npm run build 

# Expose the port the app runs on
EXPOSE 3000

# Set environment variables from .env file
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

# Copy .env file to the working directory
COPY .env .

# Run the backend server
CMD ["node", "server.js"]