import axios from "axios";

const API_URL = "http://191.238.214.157:80/api/v1/clients/";

// obtain all clients
const getAllClients = () => {
    return axios.get(API_URL);
};

// obtain a client by id
const getClientById = (id) => {
    return axios.get(API_URL + id);
};

// register a new client
const saveClient = (client) => {
    return axios.post(API_URL, client);
};

// update a client
const updateClient = (client) => {
    return axios.put(API_URL, client);
};

// delete a client by id
const deleteClient = (id) => {
    return axios.delete(API_URL + id);
};

export default {
    getAllClients,
    getClientById,
    saveClient,
    updateClient,
    deleteClient,
};
