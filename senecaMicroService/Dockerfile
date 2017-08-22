FROM mhart/alpine-node-auto

RUN mkdir -p /senecamicroservice
WORKDIR /senecamicroservice

COPY package.json .
RUN npm install --production

COPY . .

CMD ["node", "user-microservice.js"]