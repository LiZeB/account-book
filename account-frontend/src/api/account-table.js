import axios from "axios";

// TODO: 后续要加上http的封装，请求和响应拦截器
export function queryOriginalData(data) {
  return axios.post("/account-web/base/list", data);
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
