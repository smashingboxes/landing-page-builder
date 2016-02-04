FROM node:4.2
RUN mkdir /sb-3-0
WORKDIR /sb-3-0
ADD package.json /sb-3-0/package.json
RUN npm install
ADD . /sb-3-0
