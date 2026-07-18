FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 8080

CMD ["sh", "-c", "npx serve -s dist -l tcp://0.0.0.0:${PORT:-8080}"]
