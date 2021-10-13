import axios from "axios";

export function queryOriginalData(params) {
  // TODO: 后续要加上http的封装，请求和响应拦截器
  return axios.get("/account-web/base/list", {
    params,
  });
}