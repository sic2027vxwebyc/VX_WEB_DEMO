import { describe, it, expect, vi } from 'vitest'
import { resolveI18nText, resolveLocalizedObject } from '@/utils/i18nResolver'

describe('i18nResolver', () => {
  const mockT = vi.fn((key) => `translated:${key}`)
  const mockTe = vi.fn((key) => !key.includes('missing'))

  describe('resolveI18nText', () => {
    it('translates existing key', () => {
      const result = resolveI18nText({ key: 'test.key', t: mockT, te: mockTe })
      expect(result).toBe('translated:test.key')
    })

    it('returns empty string for missing key', () => {
      const result = resolveI18nText({ key: 'missing.key', t: mockT, te: mockTe })
      expect(result).toBe('')
    })
  })

  describe('resolveLocalizedObject', () => {
    it('returns value for current locale', () => {
      const obj = { ko: '한글', en: 'English' }
      expect(resolveLocalizedObject(obj, 'en')).toBe('English')
    })

    it('falls back to ko when locale missing', () => {
      const obj = { ko: '한글', en: 'English' }
      expect(resolveLocalizedObject(obj, 'es')).toBe('한글')
    })

    it('returns empty string when value missing', () => {
      expect(resolveLocalizedObject(null, 'ko')).toBe('')
    })
  })
})
