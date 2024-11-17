import axios from 'axios';

const API_URL = "http://191.238.214.157:80/api/v1/CreditRequest/";
const LOAN_COST_API_URL = "http://191.238.214.157:80/api/v1/loanCost/";

// get a client by rut to check if it exists
const getClientByRut = (rut) => {
    return axios.get(`http://191.238.214.157:80/api/v1/clients/rut/${rut}`);
};

// send a credit request to the API (content is multipart/form-data because it includes a files in PDF format)
const createCreditRequest = (formData) => {
    return axios.post(API_URL, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};


// get the status of a credit request by its id
const getCreditRequestStatus = (id) => {
    return axios.get(`${API_URL}${id}/status`);
};

// calculate the cost of a loan based on the credit request id
const calculateLoanCost = (creditRequestId) => {
    return axios.get(`${LOAN_COST_API_URL}calculate/${creditRequestId}`);
};





export default {
    getClientByRut,
    createCreditRequest,
    getCreditRequestStatus,
    calculateLoanCost,
};
