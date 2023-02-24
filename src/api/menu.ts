import request from 'src/utils/request'
export function menuList() {
  return request({
    url: '/api/menu',
    method: 'get'
  })
}
