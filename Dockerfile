FROM node:15-alpine

WORKDIR /home/node/app

RUN \
    echo "http://dl-cdn.alpinelinux.org/alpine/edge/community" >> /etc/apk/repositories \
    && echo "http://dl-cdn.alpinelinux.org/alpine/edge/main" >> /etc/apk/repositories \
    && echo "http://dl-cdn.alpinelinux.org/alpine/edge/testing" >> /etc/apk/repositories \
    && apk --no-cache  update \
    && apk --no-cache  upgrade \
    && apk add --no-cache --virtual .build-deps \
    gifsicle pngquant optipng libjpeg-turbo-utils \
    udev ttf-opensans chromium \
    && rm -rf /var/cache/apk/* /tmp/*

ENV CHROME_BIN /usr/bin/chromium-browser
ENV LIGHTHOUSE_CHROMIUM_PATH /usr/bin/chromium-browser
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD 1
ENV PUPPETEER_EXECUTABLE_PATH /usr/bin/chromium-browser

COPY package.json ./
COPY yarn.lock ./
COPY src/ ./src/
COPY tsconfig* ./

RUN yarn install --frozen-lockfile --link-duplicates --ignore-scripts
RUN yarn build

CMD [ "node", "./dist/ArchAngel.js" ]
