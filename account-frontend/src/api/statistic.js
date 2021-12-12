import axios from "axios";

export function getStatisticsByCustomType(data) {
    return axios.post("/account-web/statistic/aggreateByCustomType", data).then(res => {
        return res.data;
    });
}

export function getStatisticsByGroup(data) {
    return axios.post("/account-web/statistic/getStatistics", data).then(res => {
        return res.data;
    });
}