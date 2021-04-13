FROM node:15.14 AS builder

ARG VERSION

RUN git clone --branch "$VERSION" --single-branch --depth 1 \
    https://github.com/korylprince/snmp-tracker-ui.git /src

WORKDIR /src

RUN npm install && \
    npm run build && \
    rm -rf node_modules && \
    npm install --only=prod

FROM node:15.14

COPY --from=builder /src /dist

WORKDIR /dist

ENV HOST 0.0.0.0

CMD ["npm", "run", "start"]
