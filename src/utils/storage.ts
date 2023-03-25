/**
 * 存
 * @param key 存取的localStorage的键
 * @param value 要存储的值
 * @param expTime 过期时间 单位：小时
 */
const storage = {
  set(key: string, value: object | string, expTime = 0) {
    localStorage.setItem(key, typeof value == 'string' ? value : JSON.stringify(value))
    if (expTime > 0) {
      localStorage.setItem(
        `${key}-expTime`,
        new Date(Date.now() + expTime * 60 * 60 * 1000).toString()
      )
    }
  },
  get(key: string) {
    const data = localStorage.getItem(key) || ''
    try {
      return JSON.parse(data)
    } catch (error) {
      return data
    }
  },
  remove(key: string) {
    localStorage.removeItem(key)
    localStorage.removeItem(`${key}-expTime`)
  }
}

export default storage
