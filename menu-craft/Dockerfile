FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

ARG VITE_API_URL=http://localhost:3000
ENV VITE_API_URL=$VITE_API_URL
RUN npm run build

EXPOSE 8080

CMD ["sh", "-c", "npx serve -s dist -l tcp://0.0.0.0:${PORT:-8080}"]
