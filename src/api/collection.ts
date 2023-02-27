import request from 'src/utils/request'
import qs from 'qs'

// 获取列表
export function getCollection(data: any) {
  const params = qs.stringify(data)
  return request({
    url: '/api/collection/list' + (params ? '?' + params : ''),
    method: 'get'
  })
}
