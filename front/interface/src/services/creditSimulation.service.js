import axios from "axios";

const API_URL = "http://191.238.214.157:80/api/CreditSimulation/";

const simulateCredit = (creditSimulation) => {
    return axios.post(API_URL, creditSimulation);
};

export default {
    simulateCredit,
};
