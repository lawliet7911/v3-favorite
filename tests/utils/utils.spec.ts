import { describe, it, expect } from 'vitest'
import { dateFormat } from '../../src/utils/date'
import { isObject } from '../../src/utils/common'

describe('dateFormat', () => {
  it('should format date correctly', () => {
    const date = new Date('2022-01-01 12:34:56')
    expect(dateFormat(date, 'yyyy-MM-dd HH:mm:ss')).toBe('2022-01-01 12:34:56')
  })

  it('should format date correctly with different format', () => {
    const date = new Date('2022-01-01 12:34:56')
    expect(dateFormat(date, 'yyyy/MM/dd HH:mm:ss')).toBe('2022/01/01 12:34:56')
  })

  it('should format date correctly with single digit month', () => {
    const date = new Date('2022-01-01 12:34:56')
    expect(dateFormat(date, 'yyyy-M-d H:m:s')).toBe('2022-1-1 12:34:56')
  })

  it('should format date correctly with single digit day', () => {
    const date = new Date('2022-01-01 12:34:56')
    expect(dateFormat(date, 'yyyy-MM-d HH:mm:ss')).toBe('2022-01-1 12:34:56')
  })

  it('should format date correctly with single digit hour', () => {
    const date = new Date('2022-01-01 01:34:56')
    expect(dateFormat(date, 'yyyy-MM-dd H:mm:ss')).toBe('2022-01-01 1:34:56')
  })

  it('should format date correctly with single digit minute', () => {
    const date = new Date('2022-01-01 12:01:56')
    expect(dateFormat(date, 'yyyy-MM-dd HH:m:ss')).toBe('2022-01-01 12:1:56')
  })

  it('should format date correctly with single digit second', () => {
    const date = new Date('2022-01-01 12:34:01')
    expect(dateFormat(date, 'yyyy-MM-dd HH:mm:s')).toBe('2022-01-01 12:34:1')
  })
})

describe('isObject', () => {
  it('should return true if the input is an object', () => {
    expect(isObject({})).toBe(true)
    expect(isObject([])).toBe(true)
    expect(isObject(null)).toBe(false)
    expect(isObject(undefined)).toBe(false)
    expect(isObject('')).toBe(false)
    expect(isObject(1)).toBe(false)
    expect(isObject(true)).toBe(false)
  })
})
