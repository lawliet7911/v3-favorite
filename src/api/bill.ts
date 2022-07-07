import request from "src/utils/request";
import qs from "qs";
// 获取列表
export function getBillList(data:any) {
  let params = qs.stringify(data);
  return request({
    url: "/api/bill/list" + (params ? "?" + params : ""),
    method: "get",
  });
}

// 新增
export function addRecord(data:any) {
  return request({
    url: "/api/bill",
    method: "post",
    data: data,
  });
}

// 编辑
export function updateRecord(data:any) {
  return request({
    url: `/api/bill/${data.id}`,
    method: "put",
    data: data,
  });
}

// 删除
export function delBillRecord(id:string) {
  return request({
    url: `/api/bill/${id}`,
    method: "delete",
  });
}

// 查询当月总信息 （统计）
export function curMonthCost() {
  return request({
    url: `/api/bill/curMonthCost`,
    method: "GET",
  });
}

//
export function monthChart(data:any) {
  return request({
    url: `/api/budget/monthChart`,
    method: "GET",
    params: data,
  });
}

export function budgetMonthCost(data:any) {
  console.log(data);
  return request({
    url: `/api/budget/monthCost`,
    method: "GET",
    params: data,
  });
}

export function addBudget(data:any) {
  return request({
    url: `/api/budget`,
    method: "POST",
    data: data,
  });
}
