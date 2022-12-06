FROM node:14
WORKDIR /usr/src/backend

COPY package*.json ./

RUN yarn install

COPY . .

EXPOSE 4000

CMD [ "yarn", "start" ]