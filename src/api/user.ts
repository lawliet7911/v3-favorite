import request from 'src/utils/request'

export function checkPwd(data: any) {
  return request({
    url: '/api/user/checkPwd',
    method: 'post',
    data: data
  })
}

export function checkEncryption(data: any) {
  return request({
    url: '/api/encryption/checkEncryption',
    method: 'post',
    data: data
  })
}
