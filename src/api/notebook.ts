import request from 'src/utils/request'
import qs from 'qs'
interface BaseResponse {
  success: boolean
  data: []
  message?: string
  code: number | string
}
// 获取全部
export function getNotes(data: any) {
  let params = qs.stringify(data)
  return request({
    url: '/api/notebook/list' + (params ? '?' + params : ''),
    method: 'get',
  })
}

export function getNote(id: string | number) {
  return request({
    url: '/api/notebook/' + id,
    method: 'get',
  })
}

// 新增
export function saveNote(data: any) {
  return request({
    url: '/api/notebook',
    method: 'post',
    data: data,
  })
}
// 编辑
export function updateNote(data: any){
  return request({
    url: `/api/notebook/${data.id}`,
    method: 'put',
    data: data,
  })
}

// 删除
export function delNote(id: string | number) {
  return request({
    url: `/api/notebook/${id}`,
    method: 'delete',
  })
}
