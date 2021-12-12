import axios from "axios";

export function uploadWX(data, config) {
  return axios.post("/account-web/upload/uploadWx", data, config).then(res => {
    return res.data;
  });
}

export function uploadZFB(data, config) {
  return axios.post("/account-web/upload/uploadZfb", data, config).then(res => {
    return res.data;
  });
}