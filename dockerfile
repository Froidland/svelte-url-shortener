FROM node:20-alpine

WORKDIR /home/node/url-shortener

COPY package.json .

COPY pnpm-lock.yaml .

RUN npm install -g pnpm

RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm build

CMD [ "node", "build/" ]
