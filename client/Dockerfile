# Use an official Node.js runtime as the base image
FROM node:18.17.0 AS build

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and yarn.lock.json to the container
COPY package*.json ./

COPY vite.config.ts ./

# Install project dependencies
RUN yarn

# Copy the rest of the application code to the container
COPY . .

# Building react container
RUN npm run build

# 2nd Part

FROM nginx

# Expose the port your application will run on
EXPOSE 4173

# Copying custom config file to nginx
COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf

# Copying all the files from dist folder to nginx
COPY --from=build /app/dist /usr/share/nginx/html
