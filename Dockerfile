FROM node:4.2
RUN mkdir /sb-3-0
WORKDIR /sb-3-0
COPY package.json /sb-3-0/package.json
RUN npm install
COPY . /sb-3-0
