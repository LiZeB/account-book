import axios from "axios";

export function queryOriginalData(data) {
  return axios.post("/account-web/base/list", data).then(res => {
    return res.data;
  });
}

export function saveOriginalData(data) {
  return axios.post("/account-web/base/create", data).then(res => {
    return res.data;
  });
}

export function deleteOriginalData(params) {
  return axios.get("/account-web/base/delete", {
    params,
  }).then(res => {
    return res.data;
  });
}

export function editOriginalData(data) {
  return axios.post("/account-web/base/edit", data).then(res => {
    return res.data;
  });
}

export function queryTypes(params) {
  return axios.get('/account-web/dic/queryTypes', {
    params,
  }).then(res => {
    return res.data;
  });
}
