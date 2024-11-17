import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, TextField, Button } from "@mui/material";
import clientService from "../services/client.service";

const AddEditClient = () => {
    const [client, setClient] = useState({
        rut: "",
        name: "",
        age: "",
        salary: "",
        email: ""
    });
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        if (id) {
            clientService.getClientById(id).then((response) => {
                setClient(response.data);
            });
        }
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setClient({ ...client, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (id) {
            clientService.updateClient(client).then(() => {
                navigate("/clients");
            });
        } else {
            clientService.saveClient(client).then(() => {
                navigate("/clients");
            });
        }
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <h2>{id ? "Editar Cliente" : "Añadir Cliente"}</h2>
            <form onSubmit={handleSubmit} style={{ width: '50%' }}>
                <TextField
                    label="RUT"
                    name="rut"
                    value={client.rut}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Nombre"
                    name="name"
                    value={client.name}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Edad"
                    name="age"
                    value={client.age}
                    onChange={handleChange}
                    type="number"
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Salario"
                    name="salary"
                    value={client.salary}
                    onChange={handleChange}
                    type="number"
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Email"
                    name="email"
                    value={client.email}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                />
                <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
                    {id ? "Actualizar Cliente" : "Guardar Cliente"}
                </Button>
            </form>
        </Box>
    );
};

export default AddEditClient;
