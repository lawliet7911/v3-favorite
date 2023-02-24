const storage = {
  /**
   * 存
   * @param key 存取的localStorage的键
   * @param value 要存储的值
   * @param expTime 过期时间 单位：小时
   */
  set(key: string, value: object | string, expTime = 0) {
    if (typeof value == 'string') localStorage.setItem(key, value)
    else localStorage.setItem(key, JSON.stringify(value))
    if (expTime > 0) {
      localStorage.setItem(
        key + '-expTime',
        new Date().setHours(parseInt(new Date().getHours().toString()) + expTime).toString()
      )
    }
  },
  /**
   * 取
   * @param key 存取的localStorage的键
   */
  get(key: string) {
    const data: string = localStorage.getItem(key) || ''
    let re
    try {
      re = JSON.parse(data)
      return re
    } catch (error) {
      return data
    }
  },
  /**
   * 删
   * @param key 存取的localStorage的键
   */
  remove(key: string) {
    localStorage.removeItem(key)
    localStorage.removeItem(key + '-expTime')
  }
}

export default storage
