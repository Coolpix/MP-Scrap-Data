# Use the official lightweight Node.js 12 image.
# https://hub.docker.com/_/node
FROM node:12-slim

# Create and change to the app directory.
RUN mkdir /src
WORKDIR /src

# Copy application dependency manifests to the container image.
# A wildcard is used to ensure both package.json AND package-lock.json are copied.
# Copying this separately prevents re-running npm install on every code change.
COPY package*.json /src/

# Install production dependencies.
RUN npm install

CMD [ "npm", "run", "build" ]

# Copy local code to the container image.
COPY . /src

ENV PORT 8080

# Run the web service on container startup.
CMD [ "npm", "start" ]