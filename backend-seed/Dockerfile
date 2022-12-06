FROM node:14
WORKDIR /usr/src/backend-seed
COPY package*.json ./
RUN yarn install
COPY . .
CMD [ "yarn", "start" ]