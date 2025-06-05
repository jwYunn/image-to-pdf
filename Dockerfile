FROM node:20-slim

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install --omit=dev && npm install @nestjs/cli

COPY . .

RUN npm run build

EXPOSE 3002

CMD ["npm", "run", "start:prod"]