FROM node:19-alpine AS builder

WORKDIR /app
COPY ./src /app

ENV NODE_ENV production
ARG NEXT_PUBLIC_APP_API_URL
ENV NEXT_PUBLIC_APP_API_URL $NEXT_PUBLIC_APP_API_URL

# 開発環境と本番環境でpackage-lock.jsonが違うケースを防ぐため、
# npm ciを使用
RUN npm ci
RUN npm run build

FROM node:19-alpine
ENV NODE_ENV production
WORKDIR /app
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./

EXPOSE 8080

CMD ["npx", "next", "start", "-p", "8080"]