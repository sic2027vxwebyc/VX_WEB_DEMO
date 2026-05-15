import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export const useThemeStore = defineStore('theme', () => {
  const theme = ref(localStorage.getItem('theme') || 'dark')
  const fontSize = ref(localStorage.getItem('fontSize') || 'medium')

  const toggleTheme = () => {
    theme.value = theme.value === 'dark' ? 'light' : 'dark'
  }

  const setFontSize = (size) => {
    fontSize.value = size
  }

  const applyTheme = () => {
    // 테마 적용
    if (theme.value === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    localStorage.setItem('theme', theme.value)

    // 텍스트 크기 적용
    document.documentElement.classList.remove('text-size-small', 'text-size-medium', 'text-size-large')
    document.documentElement.classList.add(`text-size-${fontSize.value}`)
    localStorage.setItem('fontSize', fontSize.value)
  }

  // 상태가 변경될 때마다 적용
  watch([theme, fontSize], () => {
    applyTheme()
  })

  return {
    theme,
    fontSize,
    toggleTheme,
    setFontSize,
    applyTheme
  }
})
