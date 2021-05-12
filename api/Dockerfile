FROM node:9-slim
WORKDIR /pp
COPY package.json ./app
RUN npm install
COPY . ./app
CMD ["npm","start"]