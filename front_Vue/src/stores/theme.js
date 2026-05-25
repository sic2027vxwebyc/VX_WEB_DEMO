/**
 * [ 테마 스토어 ]
 * 애플리케이션의 시각적 테마(라이트/다크 모드) 및 폰트 크기 설정을 관리합니다.
 */
import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export const useThemeStore = defineStore('theme', () => {
  const theme = ref(localStorage.getItem('theme') || 'dark')
  const fontSize = ref(localStorage.getItem('fontSize') || 'medium')

  const toggleTheme = () => {
    theme.value = theme.value === 'dark' ? 'light' : 'dark'
    localStorage.setItem('theme', theme.value)
    applyTheme()
  }

  const setFontSize = (size) => {
    fontSize.value = size
    localStorage.setItem('fontSize', size)
    applyFontSize()
  }

  const applyTheme = () => {
    if (theme.value === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  const applyFontSize = () => {
    // 텍스트 크기 조절 로직 (HTML root font-size 변경 등)
    const sizes = {
      small: '14px',
      medium: '16px',
      large: '18px'
    }
    document.documentElement.style.fontSize = sizes[fontSize.value]
  }

  // 초기 적용
  applyTheme()
  applyFontSize()

  return {
    theme,
    fontSize,
    toggleTheme,
    setFontSize,
    applyTheme
  }
})
