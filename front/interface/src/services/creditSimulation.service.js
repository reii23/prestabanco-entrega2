import axios from "axios";

const API_URL = "http://172.31.115.31:31748/api/v1/simulation/";

const simulateCredit = (creditSimulation) => {
    return axios.post(API_URL, creditSimulation);
};

export default {
    simulateCredit,
};
