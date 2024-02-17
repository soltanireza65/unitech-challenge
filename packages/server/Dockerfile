FROM node:20.11.0-alpine As development

WORKDIR /usr/src/app

COPY package.json ./
COPY lerna.json ./
COPY packages/server/package.json ./packages/server/
COPY packages/tsconfig/package.json ./packages/tsconfig/
COPY packages/types/package.json ./packages/types/

RUN npm install

COPY . .

RUN cat package.json

RUN npm run prisma:generate --prefix=packages/server

CMD ["npm", "run", "dev"]