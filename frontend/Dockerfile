FROM node:26-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 5173

# Vite কে ডকার কন্টেইনারের বাইরে পোর্ট এক্সপোজ করার নির্দেশ দেওয়া হচ্ছে
CMD ["npm", "run", "dev", "--", "--host"]
