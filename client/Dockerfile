FROM node:16

ARG ENV
WORKDIR /client/

ADD package.json package.json
RUN npm install

ADD src/ src/
ADD public/ public/
