import { ref, computed } from 'vue'
import { logger } from '@/utils/logger'

/**
 * [ AR 권한 관리 Composable ]
 * 카메라, 위치 정보 및 WebXR 지원 여부를 관리합니다.
 * Mock 모드를 지원하여 개발 환경에서 테스트가 가능합니다.
 * 
 * ※ 주의: 실제 기기에서 카메라 및 WebXR을 사용하려면 반드시 HTTPS 환경이 필요합니다.
 */
export function useArPermissions() {
  const scope = 'ArPermissions'
  
  // 권한 상태
  const cameraPermission = ref('prompt') // 'prompt', 'granted', 'denied'
  const locationPermission = ref('prompt') // 'prompt', 'granted', 'denied'
  const isWebXrSupported = ref(false)
  const isInitializing = ref(false)
  
  // Mock 모드 확인 (환경변수 기반)
  const isMockMode = computed(() => import.meta.env.VITE_AR_MOCK_MODE === 'true')

  /**
   * WebXR 지원 여부 확인
   */
  const checkWebXrSupport = async () => {
    if (isMockMode.value) {
      isWebXrSupported.value = true
      return true
    }

    if ('xr' in navigator) {
      try {
        const supported = await navigator.xr.isSessionSupported('immersive-ar')
        isWebXrSupported.value = supported
        logger.info(scope, `WebXR AR 지원 여부: ${supported}`)
        return supported
      } catch (error) {
        logger.error(scope, 'WebXR 지원 확인 중 오류 발생', error)
        isWebXrSupported.value = false
        return false
      }
    }
    
    logger.warn(scope, '이 브라우저는 WebXR을 지원하지 않습니다.')
    isWebXrSupported.value = false
    return false
  }

  /**
   * 카메라 권한 요청
   */
  const requestCameraPermission = async () => {
    if (isMockMode.value) {
      cameraPermission.value = 'granted'
      logger.info(scope, '[Mock] 카메라 권한 허용됨')
      return true
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
      // 권한 확인 후 스트림 즉시 해제 (권한만 얻기 위함)
      stream.getTracks().forEach(track => track.stop())
      cameraPermission.value = 'granted'
      logger.info(scope, '카메라 권한 허용됨')
      return true
    } catch (error) {
      cameraPermission.value = 'denied'
      logger.warn(scope, '카메라 권한 거부됨', error)
      return false
    }
  }

  /**
   * 위치 권한 요청
   */
  const requestLocationPermission = async () => {
    if (isMockMode.value) {
      locationPermission.value = 'granted'
      logger.info(scope, '[Mock] 위치 권한 허용됨')
      return true
    }

    return new Promise((resolve) => {
      if (!('geolocation' in navigator)) {
        locationPermission.value = 'denied'
        logger.warn(scope, '이 브라우저는 위치 정보를 지원하지 않습니다.')
        resolve(false)
        return
      }

      navigator.geolocation.getCurrentPosition(
        () => {
          locationPermission.value = 'granted'
          logger.info(scope, '위치 권한 허용됨')
          resolve(true)
        },
        (error) => {
          locationPermission.value = 'denied'
          logger.warn(scope, '위치 권한 거부됨', error)
          resolve(false)
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      )
    })
  }

  /**
   * 전체 권한 초기화 및 확인
   */
  const initPermissions = async () => {
    isInitializing.value = true
    const xrSupported = await checkWebXrSupport()
    isInitializing.value = false
    return xrSupported
  }

  return {
    cameraPermission,
    locationPermission,
    isWebXrSupported,
    isInitializing,
    isMockMode,
    checkWebXrSupport,
    requestCameraPermission,
    requestLocationPermission,
    initPermissions
  }
}
