FROM node:20

WORKDIR /backend

COPY package*.json ./

RUN npm install --omit=dev

RUN git config --global user.email "standard@internal.mail"
RUN git config --global user.name "Standard Name"

COPY . .

ENV PORT=8080
ENV NODE_ENV production

EXPOSE 8080


CMD ["npm", "start"]