import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { mockSecurityLogs, mockDevices } from '../data/mockSecurityTelemetryData'

export const useSecurityTelemetryStore = defineStore('securityTelemetry', () => {
  const STORAGE_KEY = 'vx:v2:admin:security-telemetry'

  // 상태 로드 (localStorage)
  const savedState = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')

  const securityLogs = ref(savedState.securityLogs || JSON.parse(JSON.stringify(mockSecurityLogs)))
  const devices = ref(savedState.devices || JSON.parse(JSON.stringify(mockDevices)))
  const operationLogs = ref(savedState.operationLogs || [])
  
  const selectedSecurityLogId = ref(null)
  const selectedDeviceId = ref(null)
  const isMockTickerRunning = ref(false)
  const lastUpdatedAt = ref(new Date().toISOString())

  // Getters
  const kpiSummary = computed(() => ({
    totalDevices: devices.value.length,
    onlineDevices: devices.value.filter(d => d.status === 'online').length,
    offlineDevices: devices.value.filter(d => d.status === 'offline').length,
    degradedDevices: devices.value.filter(d => d.status === 'degraded').length,
    newSecurityLogs: securityLogs.value.filter(l => l.status === 'new').length,
    criticalEvents: securityLogs.value.filter(l => l.severity === 'critical' && l.status !== 'resolved').length,
    unstableNetworks: devices.value.filter(d => d.networkStatus === 'unstable').length
  }))

  const criticalSecurityLogs = computed(() => securityLogs.value.filter(l => l.severity === 'critical'))
  const newSecurityLogs = computed(() => securityLogs.value.filter(l => l.status === 'new'))
  const offlineDevices = computed(() => devices.value.filter(d => d.status === 'offline'))
  
  const selectedSecurityLog = computed(() => securityLogs.value.find(l => l.id === selectedSecurityLogId.value))
  const selectedDevice = computed(() => devices.value.find(d => d.id === selectedDeviceId.value))

  // Actions
  const saveToStorage = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      securityLogs: securityLogs.value,
      devices: devices.value,
      operationLogs: operationLogs.value.slice(0, 50)
    }))
  }

  const addOperationLog = (message, type = 'info', params = null) => {
    operationLogs.value.unshift({
      id: Date.now(),
      timestamp: new Date().toISOString(),
      message,
      type,
      params
    })
    saveToStorage()
  }

  const updateSecurityLogStatus = (logId, status, memo) => {
    const log = securityLogs.value.find(l => l.id === logId)
    if (!log) return
    log.status = status
    log.memo = memo
    addOperationLog('admin.security.logs.securityLogStatusChanged', 'security', { id: logId, status })
    saveToStorage()
  }

  const updateDeviceStatus = (deviceId, payload) => {
    const device = devices.value.find(d => d.id === deviceId)
    if (!device) return
    Object.assign(device, payload)
    device.lastHeartbeatAt = new Date().toISOString()
    addOperationLog('admin.security.logs.deviceStatusUpdated', 'system', { id: deviceId })
    saveToStorage()
  }

  const refreshDeviceHeartbeat = (deviceId) => {
    const device = devices.value.find(d => d.id === deviceId)
    if (!device) return
    device.lastHeartbeatAt = new Date().toISOString()
    saveToStorage()
  }

  const resetMockSecurityTelemetry = () => {
    securityLogs.value = JSON.parse(JSON.stringify(mockSecurityLogs))
    devices.value = JSON.parse(JSON.stringify(mockDevices))
    operationLogs.value = []
    addOperationLog('admin.security.logs.reset', 'system')
    saveToStorage()
  }

  return {
    securityLogs,
    devices,
    operationLogs,
    selectedSecurityLogId,
    selectedDeviceId,
    isMockTickerRunning,
    lastUpdatedAt,
    kpiSummary,
    criticalSecurityLogs,
    newSecurityLogs,
    offlineDevices,
    selectedSecurityLog,
    selectedDevice,
    updateSecurityLogStatus,
    updateDeviceStatus,
    refreshDeviceHeartbeat,
    addOperationLog,
    resetMockSecurityTelemetry
  }
})
