FROM node:latest

RUN mkdir -p /usr/src/redcat
WORKDIR /usr/src/redcat

COPY package.json /usr/src/redcat
RUN npm install

COPY . /usr/src/redcat

CMD ["node", "Cat.js"]
