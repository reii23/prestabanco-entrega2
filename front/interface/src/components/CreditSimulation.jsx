import React, { useState } from "react";
import { 
  Box, 
  TextField, 
  Button, 
  Typography, 
  Stepper, 
  Step, 
  StepLabel,
  Paper,
  Alert,
  InputAdornment
} from "@mui/material";
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PercentIcon from '@mui/icons-material/Percent';
import creditSimulationService from "../services/creditSimulation.service";

const buttonStyles = {
    green: {
      backgroundColor: '#22c55e',  // Verde original
      color: 'white',
      '&:hover': {
        backgroundColor: '#16a34a',
      }
    },
    red: {
      backgroundColor: '#ef4444',  // Rojo original
      color: 'white',
      '&:hover': {
        backgroundColor: '#dc2626',
      }
    }
  };

const CreditSimulation = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [creditData, setCreditData] = useState({
    loanAmount: "",
    termYears: "",
    interestRate: "",
  });
  const [monthlyFee, setMonthlyFee] = useState(null);
  const [error, setError] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});

  const steps = ['Simulación', 'Confirmación', 'Comprobante'];

  const validateInputs = () => {
    const errors = {};
    if (parseFloat(creditData.loanAmount) <= 0) {
      errors.loanAmount = "El monto debe ser mayor a 0";
    }
    if (parseFloat(creditData.termYears) <= 0 || parseFloat(creditData.termYears) > 30) {
      errors.termYears = "El plazo debe estar entre 1 y 30 años";
    }
    if (parseFloat(creditData.interestRate) <= 0 || parseFloat(creditData.interestRate) > 100) {
      errors.interestRate = "La tasa debe estar entre 0.1% y 100%";
    }
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCreditData({ ...creditData, [name]: value });
    if (validationErrors[name]) {
      setValidationErrors({ ...validationErrors, [name]: null });
    }
  };

  const handleSimulate = (e) => {
    e.preventDefault();
    if (validateInputs()) {
      setActiveStep(1);
    }
  };

  const handleConfirm = async () => {
    try {
      const result = await creditSimulationService.simulateCredit({
        loanAmount: parseFloat(creditData.loanAmount),
        termYears: parseInt(creditData.termYears),
        interestRate: parseFloat(creditData.interestRate)
      });
      setMonthlyFee(result);
      setActiveStep(2);
      setError(null);
    } catch (error) {
      console.error("Error simulating credit:", error);
      setError("Hubo un problema al calcular la cuota. Se utilizó un cálculo aproximado.");
      setActiveStep(2);
    }
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
    setError(null);
  };

  const handleReset = () => {
    setCreditData({
      loanAmount: "",
      termYears: "",
      interestRate: "",
    });
    setMonthlyFee(null);
    setActiveStep(0);
    setError(null);
    setValidationErrors({});
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <Box sx={{ width: '100%', maxWidth: 600, mx: 'auto', p: 3 }}>
      <Paper elevation={3} sx={{ p: 3, backgroundColor: 'white' }}>
        <Typography variant="h5" align="center" gutterBottom sx={{ color: '#22c55e', fontWeight: 'bold' }}>
          Simulación de Crédito
        </Typography>

        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel 
                StepIconProps={{
                  sx: {
                    '&.Mui-active': { color: '#22c55e' },
                    '&.Mui-completed': { color: '#22c55e' }
                  }
                }}
              >
                {label}
              </StepLabel>
            </Step>
          ))}
        </Stepper>

        {activeStep === 0 && (
          <form onSubmit={handleSimulate}>
            <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'bold' }}>
              Ingrese el monto a solicitar:
            </Typography>
            <TextField
              placeholder="Ej: 100.000.000"
              name="loanAmount"
              value={creditData.loanAmount}
              onChange={handleChange}
              type="number"
              fullWidth
              margin="normal"
              required
              error={!!validationErrors.loanAmount}
              helperText={validationErrors.loanAmount}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <MonetizationOnIcon sx={{ color: '#22c55e' }} />
                  </InputAdornment>
                ),
                inputProps: {
                  style: { 
                    WebkitAppearance: 'none',
                    MozAppearance: 'textfield'
                  }
                }
              }}
            />

            <Typography variant="subtitle1" sx={{ mt: 2, mb: 1, fontWeight: 'bold' }}>
              Ingrese el plazo en años:
            </Typography>
            <TextField
              placeholder="Ej: 20"
              name="termYears"
              value={creditData.termYears}
              onChange={handleChange}
              type="number"
              fullWidth
              margin="normal"
              required
              error={!!validationErrors.termYears}
              helperText={validationErrors.termYears}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <AccessTimeIcon sx={{ color: '#22c55e' }} />
                  </InputAdornment>
                ),
                inputProps: {
                  style: { 
                    WebkitAppearance: 'none',
                    MozAppearance: 'textfield'
                  }
                }
              }}
            />

            <Typography variant="subtitle1" sx={{ mt: 2, mb: 1, fontWeight: 'bold' }}>
              Ingrese la tasa de interés (%):
            </Typography>
            <TextField
              placeholder="Ej: 4.5"
              name="interestRate"
              value={creditData.interestRate}
              onChange={handleChange}
              type="number"
              fullWidth
              margin="normal"
              required
              error={!!validationErrors.interestRate}
              helperText={validationErrors.interestRate}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PercentIcon sx={{ color: '#22c55e' }} />
                  </InputAdornment>
                ),
                inputProps: {
                  style: { 
                    WebkitAppearance: 'none',
                    MozAppearance: 'textfield'
                  }
                }
              }}
            />

            <Button 
              type="submit" 
              variant="contained" 
              fullWidth 
              sx={{ 
                mt: 3,
                ...buttonStyles.green
              }}
            >
              SIMULAR
            </Button>
          </form>
        )}

        {activeStep === 1 && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Monto Solicitado: {formatCurrency(creditData.loanAmount)}
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
              Plazo solicitado: {creditData.termYears} años
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
              Tasa de Interés Solicitada: {creditData.interestRate}%
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
              <Button 
                onClick={handleBack} 
                variant="contained" 
                fullWidth
                sx={buttonStyles.red}
              >
                VOLVER
              </Button>
              <Button 
                onClick={handleConfirm} 
                variant="contained" 
                fullWidth
                sx={buttonStyles.green}
              >
                CONFIRMAR
              </Button>
            </Box>
          </Box>
        )}

        {activeStep === 2 && (
          <Box sx={{ mt: 2 }}>
            {error && (
              <Alert severity="warning" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2, mb: 4 }}>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Monto
                </Typography>
                <Typography variant="body1" fontWeight="500">
                  {formatCurrency(creditData.loanAmount)}
                </Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Plazo
                </Typography>
                <Typography variant="body1" fontWeight="500">
                  {creditData.termYears} años
                </Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Tasa de Interés
                </Typography>
                <Typography variant="body1" fontWeight="500">
                  {creditData.interestRate}%
                </Typography>
              </Box>
            </Box>
            
            <Box sx={{ borderTop: 1, borderColor: 'divider', pt: 3 }}>
              <Typography variant="subtitle2" color="text.secondary">
                CUOTA MENSUAL A PAGAR:
              </Typography>
              <Typography variant="h4" fontWeight="bold" color="#22c55e">
                {monthlyFee ? formatCurrency(monthlyFee) : 'Calculando...'}
              </Typography>
            </Box>

            <Button 
              onClick={handleReset}
              variant="contained"
              fullWidth
              sx={{ 
                mt: 3,
                ...buttonStyles.green
              }}
            >
              REALIZAR OTRA SIMULACIÓN
            </Button>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default CreditSimulation;