FROM node:8

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

# Install app dependencies
# COPY package*.json /usr/src/app/



RUN npm install
# If you are building your code for production
# RUN npm install --only=production

# Bundle app source

COPY . .
# COPY . /usr/src/app

EXPOSE 3000

RUN ls

# CMD [ "npm", "start" ]

# ADD run.sh run.sh
# RUN chmod +x run.sh
# CMD ./run.sh

RUN chmod +x run.sh

CMD ./run.sh
