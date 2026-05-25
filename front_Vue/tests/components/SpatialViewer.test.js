import { mount } from '@vue/test-utils'
import { describe, it, expect, vi } from 'vitest'
import SpatialViewer from '@/features/spatial/SpatialViewer.vue'

describe('SpatialViewer', () => {
  it('disposes resources on unmount', async () => {
    // Mock renderer factory
    const disposeSpy = vi.fn()
    const mockRenderer = {
      setSize: vi.fn(),
      domElement: document.createElement('canvas'),
      dispose: disposeSpy,
      render: vi.fn()
    }
    const rendererFactory = vi.fn(() => mockRenderer)

    const wrapper = mount(SpatialViewer, {
      props: { rendererFactory }
    })
    expect(wrapper.exists()).toBe(true)
    
    wrapper.unmount()
    expect(disposeSpy).toHaveBeenCalled()
  })
})
