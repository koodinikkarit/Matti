FROM node:8.6.0
WORKDIR /usr/src/matti
ADD package.json ./package.json
RUN npm install
COPY .babelrc .
COPY src ./src
RUN npm run build
CMD ["npm", "run", "start-after-build"]
EXPOSE 8887