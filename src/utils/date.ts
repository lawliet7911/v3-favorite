/** 
 * 格式化
 * @export
 * @param {(Date | string | number)} date
 * @param {string} [fmt='yyyy-MM-dd HH:mm:ss']
 * @returns
 */
export function dateFormat(date: Date | string | number, fmt: string = 'yyyy-MM-dd HH:mm:ss') {
  if (typeof date == 'string' || typeof date == 'number') {
    date = new Date(date)
  }
  let ss = new Map([
    [/(M+)/, date.getMonth() + 1],
    [/(d+)/, date.getDate()],
    [/(H+)/, date.getHours()],
    [/(h+)/, date.getHours() % 12],
    [/(m+)/, date.getMinutes()],
    [/(s+)/, date.getSeconds()],
    [/(q+)/, Math.floor((date.getMonth() + 3) / 3)],
    [/(S)/, date.getMilliseconds()],
  ])
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(
      RegExp.$1,
      date
        .getFullYear()
        .toString()
        .substr(4 - RegExp.$1.length)
    )
  }
  ss.forEach((val, key) => {
    if (key.test(fmt)) {
      fmt = fmt.replace(RegExp.$1, 1 == RegExp.$1.length ? val.toString() : `00${val}`.substr(val.toString().length))
    }
  })
  return fmt
}
