import request from 'src/utils/request'

export function upload(form: FormData) {
  return request.post(
    '/api/upload',
    form,
    { headers: { 'Content-Type': 'multip`art/form-data', Authorization: 'Basic CrMW4xpqnqemLOHnj4gzCHLQEm0M08Ue' } }
  )
}
