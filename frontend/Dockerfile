FROM node:14
WORKDIR /usr/src/frontend
COPY package*.json ./
RUN yarn install
COPY . .
EXPOSE 8080

CMD [ "yarn", "start" ]