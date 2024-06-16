
FROM node:18

# Create app directory
WORKDIR /usr/app

# Install app dependencies
COPY package*.json ./
COPY prisma ./prisma
ENV NODE_ENV=production
RUN npm install

COPY . .

# RUN npm run init Copied out so it can be pushed to github without info
RUN npm run build

WORKDIR /usr/app

EXPOSE 3000 
CMD ["npm", "run", "docker"]
