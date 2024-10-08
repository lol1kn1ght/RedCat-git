FROM node:21.7.1

RUN mkdir -p /usr/src/redcat
WORKDIR /usr/src/redcat

COPY package.json /usr/src/redcat
RUN npm install

COPY . /usr/src/redcat

ENV TZ=Europe/Moscow
RUN cp -r -f /usr/share/zoneinfo/$TZ /etc/localtime

CMD ["node", "Cat.js"]
