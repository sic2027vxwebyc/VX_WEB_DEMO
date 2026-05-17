import { onMounted } from 'vue'
import { useDeviceSettingsStore } from '../stores/deviceSettingsStore'
import { permissionService } from '../services/permissionService'

export function useDevicePermissions() {
  const store = useDeviceSettingsStore()

  const refreshStatus = async () => {
    const camera = await permissionService.checkStatus('camera')
    const location = await permissionService.checkStatus('location')
    const push = await permissionService.checkStatus('push')

    store.updatePermission('camera', camera)
    store.updatePermission('location', location)
    store.updatePermission('push', push)
  }

  const requestPermission = async (type) => {
    const status = await permissionService.requestPermission(type)
    store.updatePermission(type, status)
    return status
  }

  onMounted(() => {
    refreshStatus()
  })

  return {
    permissions: store.permissions,
    refreshStatus,
    requestPermission
  }
}
