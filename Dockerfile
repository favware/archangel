FROM --platform=linux/amd64 node:16-buster-slim as BUILDER

WORKDIR /usr/src/app

ENV NODE_ENV="development"
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD 1

RUN apt-get update && \
    apt-get upgrade -y && \
    apt-get install -y \
    build-essential \
    python3

COPY --chown=node:node package.json .
COPY --chown=node:node yarn.lock .
COPY --chown=node:node tsconfig* .
COPY --chown=node:node src/ src/
COPY --chown=node:node scripts/ scripts/

RUN yarn install --production=false --frozen-lockfile --link-duplicates

RUN yarn build

# ================ #
#   Runner Stage   #
# ================ #

FROM --platform=linux/amd64 node:16-buster-slim AS RUNNER

ENV NODE_ENV="production"

WORKDIR /usr/src/app

RUN apt-get update && \
    apt-get upgrade -y && \
    apt-get install -y \
          build-essential \
          ca-certificates \
          dumb-init \
          gnupg \
          libxss1 \
          procps \
          python3 \
          wget \
    && \
    wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - && \
    sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' && \
    apt-get update && \
    apt-get install -y \
          google-chrome-stable \
    && \
    rm -rf /var/lib/apt/lists/*

ENV CHROME_BIN /usr/bin/google-chrome-stable
ENV LIGHTHOUSE_CHROMIUM_PATH /usr/bin/google-chrome-stable
ENV PUPPETEER_EXECUTABLE_PATH /usr/bin/google-chrome-stable
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD 1

COPY --chown=node:node --from=BUILDER /usr/src/app/dist dist

COPY --chown=node:node package.json .
COPY --chown=node:node yarn.lock .

RUN yarn install --production=true --frozen-lockfile --link-duplicates --ignore-scripts

USER node

CMD [ "dumb-init", "yarn", "start", "--enable-source-maps" ]
