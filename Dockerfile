FROM node:12-alpine

# update packages
RUN apk update

ARG PORT=80
EXPOSE ${PORT}


# create root application folder
WORKDIR /app

# copy configs to /app folder
COPY package*.json ./
COPY tsconfig.json ./
# copy source code to /app/src folder
COPY src /app/src

# check files list
RUN ls -a


RUN npm install
RUN npm run build
COPY db /dist/db


CMD [ "node", "./dist/server.js" ]
