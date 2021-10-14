import axios from "axios";

export function queryOriginalData(params) {
  // TODO: 后续要加上http的封装，请求和响应拦截器
  return axios.get("/account-web/base/list", {
    params,
  });
}

export function saveOriginalData(data) {
  return axios.post("/account-web/base/create", data);
}

export function deleteOriginalData(params) {
  return axios.get("/account-web/base/delete", {
    params,
  });
}

export function editOriginalData(data) {
  return axios.post("/account-web/base/edit", data);
}