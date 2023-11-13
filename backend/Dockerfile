FROM node:20

WORKDIR /backend

COPY package*.json ./

RUN npm install

RUN npx tsc # Compile the typescript

RUN rm -r node_modules #remove old packages
RUN rm -r src # remove ts source code

RUN npm install --omit=dev # install packages without dev dependencies

RUN git config --global user.email "standard@internal.mail"
RUN git config --global user.name "Standard Name"

COPY . .

ENV PORT=8080
ENV NODE_ENV production

EXPOSE 8080


CMD ["npm", "start"]