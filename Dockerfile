FROM node:20-alpine

ARG ARG_VITE_APP_OPEN_AI_BASE_URL
ARG ARG_VITE_APP_OPENAI_API_KEY

ENV VITE_APP_OPEN_AI_BASE_URL=${ARG_VITE_APP_OPEN_AI_BASE_URL}
ENV VITE_APP_OPENAI_API_KEY=${ARG_VITE_APP_OPENAI_API_KEY}

WORKDIR /app

COPY package.json .

RUN npm install --legacy-peer-deps

# serve
RUN npm i -g serve
# copy
COPY . .

RUN npm run build

EXPOSE 3030

CMD [ "serve", "-s", "dist" ]