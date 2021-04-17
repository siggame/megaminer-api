# Builder to compile application
FROM node:12 AS builder
WORKDIR /usr/app
COPY package*.json gulpfile.js tsconfig.json main.js ./
COPY types types/
RUN npm ci
COPY src src/
RUN npm run compile

# Final production container
FROM node:12
ENV NODE_ENV=production
WORKDIR /usr/app
COPY package*.json main.js ./
COPY configs configs/
RUN npm ci
COPY --from=builder /usr/app/release/ release/
EXPOSE 3000
CMD ["npm", "run", "start"]