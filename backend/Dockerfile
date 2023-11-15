FROM node:20

WORKDIR /backend

COPY package*.json ./

RUN npm install && npm install typescript -g

COPY . .
# Compile the typescript
RUN tsc

#remove old packages
RUN rm -r node_modules
RUN npm uninstall typescript -g 
# remove ts source code
RUN rm -r src 
# install packages without dev dependencies
RUN npm install --omit=dev 

RUN git config --global user.email "standard@internal.mail"
RUN git config --global user.name "Standard Name"

ENV PORT=8080
ENV NODE_ENV production

EXPOSE 8080


CMD ["npm", "start"]