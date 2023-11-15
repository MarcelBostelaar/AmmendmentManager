FROM node:20-alpine as build

WORKDIR /frontend

COPY package*.json ./

RUN npm install --omit=dev

COPY . .

RUN npm run build

#release step
FROM nginx:mainline-alpine3.18-slim as release

COPY --from=build /frontend/build /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]