import axios from "axios";

const API_URL = "http://172.31.118.216:30771/api/v1/simulation/";

const simulateCredit = async (creditSimulation) => {
  try {
    const response = await axios.post(API_URL, creditSimulation);
    return response.data;
  } catch (error) {
    console.error("Error calling API:", error);
    return calculateMonthlyPayment(creditSimulation);
  }
};

const calculateMonthlyPayment = ({ loanAmount, termYears, interestRate }) => {
  const monthlyRate = interestRate / 100 / 12;
  const numberOfPayments = termYears * 12;
  const monthlyPayment = 
    (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
    (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
  
  return Math.round(monthlyPayment);
};

export default {
    simulateCredit,
};

