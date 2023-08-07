# Use an official Node.js runtime as the base image
FROM node:18.17.0

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./
COPY yarn.lock ./

# Install project dependencies
RUN yarn

# Copy the rest of the application code to the container
COPY . .

# Expose the port your application will run on
EXPOSE 5173

# Command to run your application
CMD ["yarn","run", "dev"]
