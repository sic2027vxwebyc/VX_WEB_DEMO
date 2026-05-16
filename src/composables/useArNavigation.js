import { ref, onUnmounted } from 'vue'
import * as THREE from 'three'
import { logger } from '@/utils/logger'

/**
 * [ AR 내비게이션 로직 Composable ]
 * Three.js를 사용하여 카메라 화면 위에 3D 화살표를 렌더링하고
 * 목적지 방향으로 회전시킵니다.
 */
export function useArNavigation() {
  const scope = 'ArNavigation'
  
  let scene, camera, renderer, arrow
  let animationId = null
  
  const isInitialized = ref(false)
  const distanceToTarget = ref(0)
  
  /**
   * Three.js 씬 초기화
   */
  const initScene = (container, videoElement) => {
    try {
      scene = new THREE.Scene()
      
      // 카메라 설정 (FOV 75, Aspect Ratio 맞춤)
      const aspect = container.clientWidth / container.clientHeight
      camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000)
      
      renderer = new THREE.WebGLRenderer({ 
        alpha: true, 
        antialias: true,
        canvas: container 
      })
      renderer.setSize(container.clientWidth, container.clientHeight)
      renderer.setPixelRatio(window.devicePixelRatio)
      
      // 조명 추가
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.7)
      scene.add(ambientLight)
      
      const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
      directionalLight.position.set(0, 5, 5)
      scene.add(directionalLight)
      
      // 목적지 방향 화살표(삼각형) 생성
      createArrow()
      
      camera.position.z = 5
      camera.position.y = 2
      camera.lookAt(0, 0, 0)
      
      isInitialized.value = true
      animate()
      
      logger.info(scope, 'Three.js AR 씬이 초기화되었습니다.')
    } catch (error) {
      logger.error(scope, 'Three.js 초기화 중 오류 발생', error)
    }
  }

  /**
   * 3D 화살표 생성
   */
  const createArrow = () => {
    // 원뿔(Cone)을 사용하여 화살표 표현
    const geometry = new THREE.ConeGeometry(0.5, 1.5, 3)
    const material = new THREE.MeshPhongMaterial({ 
      color: 0x00dbe9, // 브랜드 메인 컬러
      emissive: 0x00dbe9,
      emissiveIntensity: 0.5,
      flatShading: true
    })
    
    arrow = new THREE.Mesh(geometry, material)
    // 화살표가 앞을 향하도록 회전 (기본적으로 위를 향함)
    arrow.rotation.x = Math.PI / 2
    
    // 외곽선 추가
    const edges = new THREE.EdgesGeometry(geometry)
    const lineMaterial = new THREE.LineBasicMaterial({ color: 0xffffff, linewidth: 2 })
    const wireframe = new THREE.LineSegments(edges, lineMaterial)
    arrow.add(wireframe)
    
    scene.add(arrow)
  }

  /**
   * 화살표 방향 업데이트
   * @param {Object} currentPos { x, y }
   * @param {Object} targetPos { x, y }
   */
  const updateDirection = (currentPos, targetPos) => {
    if (!arrow) return

    // 2D 지도 좌표(pixel/meter)를 기준으로 방향 계산
    const dx = targetPos.x - currentPos.x
    const dy = targetPos.y - currentPos.y
    
    // 거리 계산
    distanceToTarget.value = Math.sqrt(dx * dx + dy * dy).toFixed(1)
    
    // 각도 계산 (Y축 기준 회전)
    // SVG/Canvas 좌표계와 Three.js 좌표계 차이 고려
    const angle = Math.atan2(dx, dy)
    
    // 부드러운 회전을 위해 보간 적용 가능 (여기서는 직접 대입)
    arrow.rotation.y = angle
    
    // 상하 바운싱 효과 추가
    arrow.position.y = Math.sin(Date.now() * 0.005) * 0.2
  }

  /**
   * 애니메이션 루프
   */
  const animate = () => {
    animationId = requestAnimationFrame(animate)
    if (renderer && scene && camera) {
      renderer.render(scene, camera)
    }
  }

  /**
   * 리소스 해제
   */
  const dispose = () => {
    if (animationId) cancelAnimationFrame(animationId)
    if (renderer) renderer.dispose()
    if (arrow) {
      arrow.geometry.dispose()
      arrow.material.dispose()
    }
    logger.info(scope, 'AR 내비게이션 리소스가 해제되었습니다.')
  }

  onUnmounted(dispose)

  return {
    isInitialized,
    distanceToTarget,
    initScene,
    updateDirection,
    dispose
  }
}
