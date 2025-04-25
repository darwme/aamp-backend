FROM node:20

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install
RUN npm install mssql@latest

COPY . .

RUN npm rebuild bcrypt --build-from-source


RUN npm install typescript

RUN npm run build

RUN ls -la dist

EXPOSE 3001

CMD ["node", "dist/src/app.js"]
