/**
 * [API 통신 기본 설정]
 * 백엔드 미구현 상태로, 향후 API 엔드포인트와 연결할 기본 fetch 래퍼입니다.
 * 
 * @educational_comment
 * - WHY: fetch API를 직접 사용하는 대신 래퍼를 통해 공통 헤더, 에러 처리, 인증 토큰 주입을 중앙화합니다.
 * - architecture: 서비스 계층에서 호출하여 하위 컴포넌트가 통신 상세를 알 필요 없게 합니다.
 */

const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1';

async function request(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`[API Request Error] ${endpoint}:`, error);
    throw error;
  }
}

export const api = {
  get: (endpoint) => request(endpoint, { method: 'GET' }),
  post: (endpoint, data) => request(endpoint, { method: 'POST', body: JSON.stringify(data) }),
  patch: (endpoint, data) => request(endpoint, { method: 'PATCH', body: JSON.stringify(data) }),
  delete: (endpoint) => request(endpoint, { method: 'DELETE' }),
};
