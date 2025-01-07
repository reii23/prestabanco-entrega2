import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, TextField, Button, Alert } from "@mui/material";
import clientService from "../services/client.service";

const AddEditClient = () => {
    const [client, setClient] = useState({
        rut: "",
        name: "",
        age: "",
        salary: "",
        email: ""
    });
    const [message, setMessage] = useState('');
    const { id } = useParams();
    const navigate = useNavigate();

    const cleanRut = (rut) => {
        return rut.replace(/[^0-9kK]/g, '')
                 .toLowerCase()
                 .substring(0, 9);
    };

    const formatRut = (rut) => {
        const cleaned = cleanRut(rut);
        
        if (!cleaned) return '';
        
        let result = '';
        const dv = cleaned.slice(-1);
        const numbers = cleaned.slice(0, -1);
        
        for (let i = numbers.length; i > 0; i -= 3) {
            const start = Math.max(0, i - 3);
            result = '.' + numbers.substring(start, i) + result;
        }
        
        result = result.slice(1);
        return result ? `${result}-${dv}` : dv;
    };

    const validateRut = (rut) => {
        const cleaned = cleanRut(rut);
        
        if (cleaned.length < 2) return false;
        
        const body = cleaned.slice(0, -1);
        const dv = cleaned.slice(-1);
        
        if (!/^\d+$/.test(body)) return false;
        if (!/^[0-9k]$/.test(dv)) return false;
        
        let sum = 0;
        let multiplier = 2;
        
        for (let i = body.length - 1; i >= 0; i--) {
            sum += parseInt(body[i]) * multiplier;
            multiplier = multiplier === 7 ? 2 : multiplier + 1;
        }
        
        const expectedDV = 11 - (sum % 11);
        const calculatedDV = expectedDV === 11 ? '0' : expectedDV === 10 ? 'k' : expectedDV.toString();
        
        return dv === calculatedDV;
    };

    useEffect(() => {
        if (id) {
            clientService.getClientById(id).then((response) => {
                setClient(response.data);
            });
        }
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        
        if (name === 'rut') {
            const formattedRut = formatRut(value);
            setClient({ ...client, rut: formattedRut });
        } else {
            setClient({ ...client, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateRut(client.rut)) {
            setMessage('RUT inválido. Por favor verifica el formato.');
            return;
        }

        try {
            if (id) {
                await clientService.updateClient(client);
            } else {
                await clientService.saveClient(client);
            }
            navigate("/clients");
        } catch (error) {
            setMessage('Error al guardar el cliente: ' + (error.response?.data?.message || error.message));
        }
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <h2>{id ? "Editar Cliente" : "Añadir Cliente"}</h2>
            {message && (
                <Alert severity="error" sx={{ mb: 2, width: '50%' }}>
                    {message}
                </Alert>
            )}
            <form onSubmit={handleSubmit} style={{ width: '50%' }}>
                <TextField
                    label="RUT"
                    name="rut"
                    value={client.rut}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                    error={client.rut.length > 0 && !validateRut(client.rut)}
                    helperText={
                        client.rut.length > 0 && !validateRut(client.rut)
                            ? "RUT inválido"
                            : "Formato: 12.345.678-9"
                    }
                />
                <TextField
                    label="Nombre"
                    name="name"
                    value={client.name}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                    required
                />
                <TextField
                    label="Edad"
                    name="age"
                    value={client.age}
                    onChange={handleChange}
                    type="number"
                    fullWidth
                    margin="normal"
                    required
                />
                <TextField
                    label="Salario"
                    name="salary"
                    value={client.salary}
                    onChange={handleChange}
                    type="number"
                    fullWidth
                    margin="normal"
                    required
                />
                <TextField
                    label="Email"
                    name="email"
                    value={client.email}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                    required
                    type="email"
                />
                <Button 
                    type="submit" 
                    variant="contained" 
                    color="primary" 
                    sx={{ mt: 2 }}
                    disabled={!validateRut(client.rut)}
                >
                    {id ? "Actualizar Cliente" : "Guardar Cliente"}
                </Button>
            </form>
        </Box>
    );
};

export default AddEditClient;