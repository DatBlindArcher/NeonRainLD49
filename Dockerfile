FROM node:lts-alpine

# install simple http server for serving static content
RUN npm install -g http-server

# make the 'app' folder the current working directory
WORKDIR /app

# copy project public and build to workfolder
COPY public/. public/.
COPY build/. public/.

EXPOSE 8080
CMD [ "http-server" ]