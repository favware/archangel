# ================ #
#    Base Stage    #
# ================ #

FROM node:20-buster-slim as base

WORKDIR /usr/src/app

ENV CI=true
ENV NODE_ENV="development"
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD 1
ENV FORCE_COLOR=true

RUN apt-get update && \
    apt-get upgrade -y --no-install-recommends && \
    apt-get install -y --no-install-recommends build-essential python3 dumb-init && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

COPY --chown=node:node yarn.lock .
COPY --chown=node:node package.json .
COPY --chown=node:node .yarnrc.yml .
COPY --chown=node:node .yarn/ .yarn/

ENTRYPOINT ["dumb-init", "--"]

# ================ #
#   Builder Stage  #
# ================ #

FROM base as builder

ENV NODE_ENV="development"

COPY --chown=node:node tsconfig.base.json .
COPY --chown=node:node tsup.config.ts .
COPY --chown=node:node src/ src/

RUN yarn install --immutable
RUN yarn run build

# ================ #
#   Runner Stage   #
# ================ #

FROM base AS runner

ENV NODE_ENV="production"
ENV NODE_OPTIONS="--enable-source-maps --max_old_space_size=4096"

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

COPY --chown=node:node src/.env src/.env
COPY --chown=node:node --from=BUILDER /usr/src/app/dist dist

RUN yarn workspaces focus --all --production
RUN chown node:node /usr/src/app/

USER node

CMD [ "yarn", "run", "start"]
