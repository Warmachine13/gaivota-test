# FROM node:10.16.0-stretch AS builder

# # Create app directory
# WORKDIR /usr/src/app

# # Install app dependencies
# # A wildcard is used to ensure both package.json AND package-lock.json are copied
# # where available (npm@5+)
# COPY package*.json ./

# RUN yarn install --network-timeout 1000000

# # Bundle app source
# COPY . .
# # If you are building your code for production
# #RUN npm ci --only=production

# RUN yarn build

# # RUN rm  build/static/css/*.map
# # RUN rm  build/static/js/*.map 

# # FROM nginx:alpine
# FROM nginx:1.17.1-alpine
# COPY --from=build-step /app/build /usr/share/nginx/html


# # COPY nginx.conf /etc/nginx/conf.d/default.conf
# # COPY --from=builder /usr/src/app/build/ /usr/share/nginx/html/




# FROM node:14.9


# RUN mkdir /app

# WORKDIR /app

# COPY package.json /app
# RUN npm install


# COPY . /app

# RUN npm run build
# FROM nginx:1.17.1-alpine


# COPY --from=build-step /app/build /usr/share/nginx/html

FROM node:14.9
 
WORKDIR /usr/src/app
 
COPY package*.json ./
 
RUN npm install
 
COPY . .
 
EXPOSE 3000
 
CMD [ "npm", "start" ]