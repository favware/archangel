FROM node:15-alpine

WORKDIR /home/node/app

ENV NODE_ENV production

COPY package.json ./
COPY yarn.lock ./
COPY dist/ ./dist/

RUN yarn install --frozen-lockfile --link-duplicates --no-bin-links --ignore-scripts

CMD [ "node", "./dist/ArchAngel.js" ]