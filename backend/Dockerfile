
FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install
COPY . .
RUN npx prisma generate
RUN yarn build

FROM node:20-alpine
RUN apk add --no-cache netcat-openbsd
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install
RUN yarn global add ts-node typescript
COPY prisma ./prisma
RUN npx prisma generate
COPY --from=builder /app/dist ./dist
COPY scripts/init.sh /app/init.sh
COPY scripts/wait-for-it.sh /app/wait-for-it.sh
RUN chmod +x /app/init.sh /app/wait-for-it.sh
EXPOSE 3000
CMD ["/app/init.sh"] 