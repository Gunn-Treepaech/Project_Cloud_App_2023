FROM node:18-alpine

WORKDIR /app

COPY package.json .

Run `npm install -g npm@10.5.0`

RUN npm install

COPY . .

EXPOSE 5173

CMD [ "npm", "run", "dev" ]
