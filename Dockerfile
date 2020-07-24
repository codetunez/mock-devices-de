FROM node:12

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install && npm install typescript -g
COPY . ./
RUN tsc
CMD [ "node", "./_dist/start.js" ]
EXPOSE 9100