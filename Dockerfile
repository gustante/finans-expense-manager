# Use the official lightweight Node.js 12 image.
# https://hub.docker.com/_/node
FROM node:12-alpine

# Create and change to the app directory.
WORKDIR /usr/src/app

# Copy local code to the container image.
COPY . ./

# Install dependencies.
RUN npm install 



# Run the web service on container startup.
CMD [ "npm", "start" ]
