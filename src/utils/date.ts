/**
 * 日期格式化
 * @export
 * @param {(Date | string | number)} date
 * @param {string} [format='yyyy-MM-dd HH:mm:ss']
 * @returns {string} formatted date string
 */
export function dateFormat(date: Date | string | number, format = 'yyyy-MM-dd HH:mm:ss'): string {
  if (typeof date === 'string' || typeof date === 'number') {
    date = new Date(date)
  }
  const formatMap = new Map([
    [/(M+)/, date.getMonth() + 1],
    [/(d+)/, date.getDate()],
    [/(H+)/, date.getHours()],
    [/(h+)/, date.getHours() % 12],
    [/(m+)/, date.getMinutes()],
    [/(s+)/, date.getSeconds()],
    [/(q+)/, Math.floor((date.getMonth() + 3) / 3)],
    [/(S)/, date.getMilliseconds()]
  ])
  if (/(y+)/.test(format)) {
    format = format.replace(
      RegExp.$1,
      date
        .getFullYear()
        .toString()
        .substr(4 - RegExp.$1.length)
    )
  }
  formatMap.forEach((value, key) => {
    if (key.test(format)) {
      format = format.replace(
        RegExp.$1,
        1 === RegExp.$1.length ? value.toString() : `00${value}`.substr(value.toString().length)
      )
    }
  })
  return format
}
