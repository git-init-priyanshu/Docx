# Use an official Node.js runtime as the base image
FROM node:20.3.1

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install project dependencies
RUN npm install
RUN npm uninstall bcrypt
RUN npm i bcrypt

# Copy the rest of the application code to the container
COPY . .

# Setting up the environment variables
ENV MONGODB_URI=URI
ENV SALT=00
ENV JWT_SECRET=value

# Expose the port your application will run on
EXPOSE 4000

# Command to run your application
CMD ["npm","run", "dev"]
