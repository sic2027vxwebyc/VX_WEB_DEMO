// back_Go/main.go
package main

import (
	"fmt"
	"net/http"
)

// main은 Go API 서버를 초기화합니다.
func main() {
	// Root 핸들러: API 기본 상태 확인용
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprintf(w, "Hello from Go Backend!")
	})
	
	fmt.Println("Backend server started on :8080")
	// 서버 시작 (에러 처리 추가 권장)
	if err := http.ListenAndServe(":8080", nil); err != nil {
		fmt.Println("Server error:", err)
	}
}
