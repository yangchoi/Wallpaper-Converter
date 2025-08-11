FROM node:20-bullseye

# ffmpeg 설치
RUN apt-get update && apt-get install -y ffmpeg && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# 의존성 설치
COPY package*.json ./
RUN npm ci

# 소스 복사 및 빌드
COPY . .
RUN npm run build

EXPOSE 4000
CMD ["node", "dist/main.js"]
