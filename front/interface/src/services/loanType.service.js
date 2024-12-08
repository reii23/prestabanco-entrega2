import axios from 'axios';

const API_URL = "http://172.23.4.59:32216/api/v1/LoanType/";

// obtain all loan types (first dwelling, second dwelling, etc)
const getAllLoanTypes = () => {
    return axios.get(API_URL);
};

export default {
    getAllLoanTypes,
};
