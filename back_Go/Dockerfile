FROM golang:1.22-alpine
WORKDIR /app
# go.mod 초기화가 필요하므로 COPY 전에 설정
COPY go.mod* go.sum* ./
RUN go mod download || go mod init vx-web-demo-back
COPY . .
RUN go build -o main .
EXPOSE 8080
CMD ["./main"]
