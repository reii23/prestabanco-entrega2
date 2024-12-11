import axios from "axios";

const API_URL = "http://172.23.4.59:30626/api/v1/simulation/";

const simulateCredit = (creditSimulation) => {
    return axios.post(API_URL, creditSimulation);
};

export default {
    simulateCredit,
};
