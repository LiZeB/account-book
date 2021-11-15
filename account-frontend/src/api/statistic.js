import axios from "axios";

export function getStatisticsByCustomType() {
    return axios.get("/account-web/statistic/aggreateByCustomType");
}