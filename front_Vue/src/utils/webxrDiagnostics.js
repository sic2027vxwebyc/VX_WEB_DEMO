import { logger } from './logger'

/**
 * [ WebXR 진단 유틸리티 ]
 * 브라우저 및 기기의 WebXR 지원 상태를 정밀하게 분석합니다.
 */
export async function getWebXRDiagnostics() {
  const result = {
    url: window.location.href,
    userAgent: navigator.userAgent,
    isSecureContext: window.isSecureContext,
    hasNavigatorXR: !!navigator.xr,
    supportsInline: false,
    supportsImmersiveVR: false,
    supportsImmersiveAR: false,
    webglAvailable: false,
    errors: []
  }

  // 1. WebGL 가용성 체크
  try {
    const canvas = document.createElement('canvas')
    result.webglAvailable = !!(
      canvas.getContext('webgl') || 
      canvas.getContext('webgl2')
    )
  } catch (error) {
    result.errors.push({ type: 'WEBGL_CHECK_FAILED', message: error.message })
  }

  // 2. WebXR 세션 지원 체크
  if (navigator.xr) {
    const modes = ['inline', 'immersive-vr', 'immersive-ar']
    for (const mode of modes) {
      try {
        const supported = await navigator.xr.isSessionSupported(mode)
        if (mode === 'inline') result.supportsInline = supported
        if (mode === 'immersive-vr') result.supportsImmersiveVR = supported
        if (mode === 'immersive-ar') result.supportsImmersiveAR = supported
      } catch (error) {
        result.errors.push({ 
          type: `${mode.toUpperCase()}_CHECK_FAILED`, 
          message: error.message 
        })
      }
    }
  } else {
    if (!result.isSecureContext) {
      result.errors.push({ 
        type: 'INSECURE_CONTEXT', 
        message: 'WebXR requires a secure context (HTTPS).' 
      })
    }
  }

  logger.info('WebXRDiagnostics', '진단 완료:', result)
  return result
}

/**
 * 지원 미비 사유에 따른 다국어 키 반환
 */
export function getXRUnsupportedReason(mode, diagnostics) {
  if (!diagnostics.isSecureContext) return 'errors.webxr.insecureContext'
  if (!diagnostics.hasNavigatorXR) return 'errors.webxr.noNavigatorXR'
  if (!diagnostics.webglAvailable) return 'errors.webxr.noWebGL'
  
  if (mode === 'immersive-vr' && !diagnostics.supportsImmersiveVR) {
    return 'errors.webxr.vrNotSupported'
  }
  if (mode === 'immersive-ar' && !diagnostics.supportsImmersiveAR) {
    return 'errors.webxr.arNotSupported'
  }
  
  return 'errors.webxr.unknown'
}
