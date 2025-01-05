import axios from 'axios';

const API_URL = "http://172.31.118.216:30771/api/v1/LoanType/";

// obtain all loan types (first dwelling, second dwelling, etc)
const getAllLoanTypes = () => {
    return axios.get(API_URL);
};

export default {
    getAllLoanTypes,
};
