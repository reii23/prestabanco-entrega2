import axios from "axios";

const API_URL = "http://172.23.4.59:32216/api/evaluation/";

const simulateCredit = (creditSimulation) => {
    return axios.post(API_URL, creditSimulation);
};

export default {
    simulateCredit,
};
