FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5173
# 개발 모드 및 핫 리로딩 활성화
CMD ["npm", "run", "dev", "--", "--host"]
