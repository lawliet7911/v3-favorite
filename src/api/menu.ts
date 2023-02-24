import request from 'src/utils/request'
export function menuList(params: any) {
  return request({
    url: '/api/menu',
    method: 'get'
  })
}
