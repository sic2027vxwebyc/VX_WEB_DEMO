import { ref, onMounted, onUnmounted } from 'vue'

/**
 * 드래그 투 스크롤 컴포저블
 * @param {Ref<HTMLElement>} elRef 대상 엘리먼트 Ref
 * @returns {Object} { dragMoved }
 */
export function useDragScroll(elRef) {
  const dragMoved = ref(false)
  let isDown = false
  let startX
  let scrollLeft

  const handleMouseDown = (e) => {
    isDown = true
    dragMoved.value = false
    elRef.value.classList.add('grabbing')
    startX = e.pageX - elRef.value.offsetLeft
    scrollLeft = elRef.value.scrollLeft
  }

  const handleMouseLeave = () => {
    if (!isDown) return
    isDown = false
    elRef.value.classList.remove('grabbing')
  }

  const handleMouseUp = () => {
    if (!isDown) return
    isDown = false
    elRef.value.classList.remove('grabbing')
  }

  const handleMouseMove = (e) => {
    if (!isDown) return
    e.preventDefault()
    const x = e.pageX - elRef.value.offsetLeft
    const walk = (x - startX) * 2
    
    if (Math.abs(x - startX) > 5) {
      dragMoved.value = true
    }
    
    elRef.value.scrollLeft = scrollLeft - walk
  }

  onMounted(() => {
    const el = elRef.value
    if (!el) return
    
    el.addEventListener('mousedown', handleMouseDown)
    el.addEventListener('mouseleave', handleMouseLeave)
    el.addEventListener('mouseup', handleMouseUp)
    el.addEventListener('mousemove', handleMouseMove)
  })

  onUnmounted(() => {
    const el = elRef.value
    if (!el) return
    
    el.removeEventListener('mousedown', handleMouseDown)
    el.removeEventListener('mouseleave', handleMouseLeave)
    el.removeEventListener('mouseup', handleMouseUp)
    el.removeEventListener('mousemove', handleMouseMove)
  })

  return {
    dragMoved
  }
}
