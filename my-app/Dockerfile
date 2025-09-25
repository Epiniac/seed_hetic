FROM node:20-alpine

RUN apk add --no-cache bash git python3 make g++ \
    && npm install -g expo-cli \
    && npm install -g @expo/ngrok 

ENV EXPO_NO_INTERACTIVE=false

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

EXPOSE 8081

CMD ["npx", "expo", "start", "--tunnel"]
