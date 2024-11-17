import React, { useState } from "react";
import { Box, TextField, Button, Typography } from "@mui/material";
import creditSimulationService from "../services/creditSimulation.service";

const CreditSimulation = () => {
    const [creditData, setCreditData] = useState({
        loanAmount: "",
        termYears: "",
        interestRate: "",
    });
    const [monthlyFee, setMonthlyFee] = useState(null);

    // The user enters data in the form fields, the state is updated with the new values entered by the user.
    const handleChange = (e) => {
        const { name, value } = e.target;
        setCreditData({ ...creditData, [name]: value });
    };

    // The form is submitted, the credit simulation is calculated with the data (loan amount, term in years, and interest rate) entered by the user.
    const handleSubmit = (e) => {
        e.preventDefault();
        creditSimulationService.simulateCredit(creditData).then((response) => {
            setMonthlyFee(response.data);
        });
    };

    // The form is displayed to the user, where they can enter the loan amount, term in years, and interest rate to simulate the credit.
    return (
        // Box: Container component that provides a flexible box layout model.
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 4 }}>
            <h1>Simulación de Crédito</h1>
            <h4>Completa los datos solicitados para conocer la cuota mensual a pagar</h4>
            <form onSubmit={handleSubmit} style={{ width: '50%' }}>
                <TextField
                    label="Monto del Préstamo"
                    name="loanAmount"
                    value={creditData.loanAmount}
                    onChange={handleChange}
                    type="number"
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Plazo en Años"
                    name="termYears"
                    value={creditData.termYears}
                    onChange={handleChange}
                    type="number"
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Tasa de Interés (%)"
                    name="interestRate"
                    value={creditData.interestRate}
                    onChange={handleChange}
                    type="number"
                    fullWidth
                    margin="normal"
                />
                <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
                    Calcular Cuota Mensual (Chile)
                </Button>
            </form>
                        
            {monthlyFee && (
                <Typography variant="h6" sx={{ mt: 4}}>
                    La cuota mensual es: $ {monthlyFee}
                </Typography>
            )}
        </Box>
    );
};

export default CreditSimulation;
