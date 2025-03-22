# Use a Node.js base image
FROM node:20

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Set NODE_ENV for Webpack build
ARG NODE_ENV=development
ENV NODE_ENV=$NODE_ENV

# Build the frontend using Webpack
RUN npx webpack

# Expose the port your app uses
EXPOSE 3000

# Command to run the application
CMD ["npm", "start"]