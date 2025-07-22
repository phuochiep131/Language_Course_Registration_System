FROM node:18

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Build project
RUN npm run build

# Serve app using serve
RUN npm install -g serve
EXPOSE 3000
CMD ["npm", "start"]
