import request from 'src/utils/request'

export function upload(form: FormData) {
  return request.post('/api/upload', form, { headers: { 'Content-Type': 'multipart/form-data' } })
}
