FROM node:10

RUN mkdir /app
COPY . /app
WORKDIR /app
ENV GOOGLE_APPLICATION_CREDENTIALS "/app/service_account_key.json"
RUN npm rebuild && npm install
ENTRYPOINT [ "node" ]
CMD ["server.js"]
