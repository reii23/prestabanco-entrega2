import React, { useState } from "react";
import { Box, TextField, Button, Typography } from "@mui/material";
import creditRequestService from "../services/creditRequest.service";

const LoanCostView = () => {
    const [creditRequestId, setCreditRequestId] = useState('');
    const [loanCostTotal, setLoanCostTotal] = useState(null);
    const [message, setMessage] = useState('');

    const handleLoanCostCalculation = async (e) => {
        e.preventDefault();
        try {
            const response = await creditRequestService.calculateLoanCost(creditRequestId);
            setLoanCostTotal(response.data);
            setMessage('');
        } catch (error) {
            setMessage('No se encontró la solicitud de crédito para el ID proporcionado');
            setLoanCostTotal(null);
        }
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 4 }}>
            <Typography variant="h4" gutterBottom>
                Cálculo de Costos Totales
            </Typography>
            <Typography variant="body1" sx={{ textAlign: 'center', mb: 2 }}>
                Ingrese el ID de su solicitud para calcular el costo total del préstamo
            </Typography>
            <form onSubmit={handleLoanCostCalculation} style={{ width: '50%' }}>
                <TextField
                    label="Ingrese el ID de la Solicitud"
                    name="creditRequestId"
                    value={creditRequestId}
                    onChange={(e) => setCreditRequestId(e.target.value)}
                    fullWidth
                    margin="normal"
                />
                <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
                    Calcular Costo
                </Button>
            </form>

            {message && (
                <Typography color="error" sx={{ mt: 2 }}>
                    {message}
                </Typography>
            )}

            {loanCostTotal !== null && (
                <Typography variant="h5" sx={{ mt: 4 }}>
                    Costo total del préstamo: {loanCostTotal.toFixed(2)}
                </Typography>
            )}
        </Box>
    );
};

export default LoanCostView;
