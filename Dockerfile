# Use the official image as a parent image
FROM node:current-slim

# Set the working directory
WORKDIR /usr/src/app

COPY src src

# Copy the file from your host to your current location
COPY package.json .
COPY tsconfig.build.json .
COPY tsconfig.json .
COPY .production.env .env
COPY package-lock.json .

# Run the command inside your image filesystem
RUN npm install

# Build
RUN npm run build

# Inform Docker that the container is listening on the specified port at runtime.
EXPOSE 3000

# Run the specified command within the container.
CMD [ "npm", "run", "start:prod" ]

# Copy the rest of your app's source code from your host to your image filesystem.
# COPY ./dist/src ./dist
# RUN mv ./dist/src ./dist
# COPY /.

# Initial migration (should eventually copy from ../gather-clients/../migration/*)
# COPY migrations ./dist/migrations