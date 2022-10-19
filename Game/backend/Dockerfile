FROM node:16-alpine
WORKDIR /usr/src/app

ENV NODE_ENV=production

COPY . .

RUN corepack enable
RUN yarn set version 3.2.4
RUN yarn install --immutable

EXPOSE 8080

CMD ["yarn", "start"]
