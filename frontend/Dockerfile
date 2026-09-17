FROM node:20-alpine
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install --legacy-peer-deps

COPY . .

ARG VITE_API_URL=http://localhost:8080
ARG VITE_WS_URL=ws://localhost:8080/ws/prices
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_WS_URL=$VITE_WS_URL

RUN npm run build

EXPOSE 80
# Runs the Vite preview server on port 80 host 0.0.0.0 to match docker-compose port mapping
CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0", "--port", "80"]
