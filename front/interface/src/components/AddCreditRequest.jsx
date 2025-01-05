import React, { useState, useEffect } from 'react';
import {
    Box,
    TextField,
    Button,
    Typography,
    MenuItem,
    Select,
    InputLabel,
    FormControl,
    Paper,
    Stepper,
    Step,
    StepLabel,
    Alert,
    InputAdornment
} from '@mui/material';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PercentIcon from '@mui/icons-material/Percent';
import PersonIcon from '@mui/icons-material/Person';
import HomeIcon from '@mui/icons-material/Home';
import DescriptionIcon from '@mui/icons-material/Description';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import creditRequestService from '../services/creditRequest.service';
import loanTypeService from '../services/loanType.service';

const buttonStyles = {
    green: {
        backgroundColor: '#22c55e',
        color: 'white',
        '&:hover': {
            backgroundColor: '#16a34a',
        }
    },
    red: {
        backgroundColor: '#ef4444',
        color: 'white',
        '&:hover': {
            backgroundColor: '#dc2626',
        }
    }
};

const AddCreditRequest = () => {
    const [activeStep, setActiveStep] = useState(0);
    const [rut, setRut] = useState('');
    const [client, setClient] = useState(null);
    const [loanTypes, setLoanTypes] = useState([]);
    const [creditData, setCreditData] = useState({
        clientId: '',
        expenses: '',
        loanTypeId: '',
        loanType: '',
        requestedAmount: '',
        termYears: '',
        interestRate: ''
    });
    const [validationErrors, setValidationErrors] = useState({});
    const [message, setMessage] = useState('');

    // Estados para los archivos PDF
    const [incomeProofPdf, setIncomeProofPdf] = useState(null);
    const [propertyValuationPdf, setPropertyValuationPdf] = useState(null);
    const [creditHistoryPdf, setCreditHistoryPdf] = useState(null);
    const [firstPropertyDeedPdf, setFirstPropertyDeedPdf] = useState(null);
    const [financialStateBusinessPdf, setFinancialStateBusinessPdf] = useState(null);
    const [renovationBudgetPdf, setRenovationBudgetPdf] = useState(null);
    const [businessPlanPdf, setBusinessPlanPdf] = useState(null);

    const steps = ['Identificación', 'Información del Crédito', 'Documentación', 'Confirmación'];

    // Efecto para cargar los tipos de préstamos
    useEffect(() => {
        const fetchLoanTypes = async () => {
            try {
                const response = await loanTypeService.getAllLoanTypes();
                setLoanTypes(response.data);
            } catch (error) {
                console.error("Error obteniendo tipos de préstamos", error);
                setMessage('Error al cargar los tipos de préstamos');
            }
        };
        fetchLoanTypes();
    }, []);

    // TO DO: Validar rut
    const validateRut = (rut) => {
        return rut.length > 0;
    };

    const validateCreditData = () => {
        const errors = {};
        if (parseFloat(creditData.expenses) <= 0) {
            errors.expenses = "Los gastos deben ser mayores a 0";
        }
        if (parseFloat(creditData.requestedAmount) <= 0) {
            errors.requestedAmount = "El monto solicitado debe ser mayor a 0";
        }
        if (parseFloat(creditData.termYears) <= 0 || parseFloat(creditData.termYears) > 30) {
            errors.termYears = "El plazo debe estar entre 1 y 30 años";
        }
        if (parseFloat(creditData.interestRate) <= 0 || parseFloat(creditData.interestRate) > 100) {
            errors.interestRate = "La tasa debe estar entre 0.1% y 100%";
        }
        if (!creditData.loanTypeId) {
            errors.loanTypeId = "Debe seleccionar un tipo de préstamo";
        }
        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleRutSubmit = async (e) => {
        e.preventDefault();
        if (!validateRut(rut)) {
            setMessage('RUT inválido');
            return;
        }
        try {
            const response = await creditRequestService.getClientByRut(rut);
            setClient(response.data); // obtain the client data (id) 
            setCreditData({ ...creditData, clientId: response.data.id });
            setMessage('');
            setActiveStep(1);
        } catch (error) {
            setMessage('Client not found');
            setClient(null);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
    
        if (name === 'loanTypeId') {
            const selectedLoanType = loanTypes.find(loan => loan.id === parseInt(value));
            
            // reset the files when changing the loan type (to avoid sending the wrong files)
            setIncomeProofPdf(null);
            setPropertyValuationPdf(null);
            setCreditHistoryPdf(null);
            setFirstPropertyDeedPdf(null);
            setFinancialStateBusinessPdf(null);
            setRenovationBudgetPdf(null);
            setBusinessPlanPdf(null);

            setCreditData({
                ...creditData,
                loanTypeId: parseInt(value),
                loanType: selectedLoanType?.name || ''
            });
        } else {
            setCreditData({ ...creditData, [name]: value });
        }
        if (validationErrors[name]) {
            setValidationErrors({ ...validationErrors, [name]: null });
        }
    };
    // change the file to upload (income proof, property valuation, credit history, firstPropertyDeedPdf)
    const handleFileChange = (e, setFile) => {
        const file = e.target.files[0];
        if (file && file.type === 'application/pdf') {
            setFile(file);
        } else {
            setMessage('Solo se permiten archivos PDF');
        }
    };

    const handleNext = () => {
        if (activeStep === 1 && !validateCreditData()) {
            return;
        }
        setActiveStep((prevStep) => prevStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevStep) => prevStep - 1);
    };

    const renderDocumentFields = () => {
        const renderFileButton = (label, file, setFile, icon) => (
            <Box sx={{
                my: 2,
                p: 2,
                border: '1px dashed #ccc',
                borderRadius: 1,
                backgroundColor: file ? '#f0fdf4' : 'transparent'
            }}>
                <Button
                    component="label"
                    variant="outlined"
                    startIcon={icon || <CloudUploadIcon />}
                    sx={{
                        width: '100%',
                        color: file ? '#22c55e' : 'primary',
                        borderColor: file ? '#22c55e' : 'primary'
                    }}
                >
                    {label}
                    <input
                        type="file"
                        hidden
                        onChange={(e) => handleFileChange(e, setFile)}
                        accept="application/pdf"
                    />
                </Button>
                {file && (
                    <Typography variant="body2" sx={{ mt: 1, color: '#22c55e' }}>
                        Archivo seleccionado: {file.name}
                    </Typography>
                )}
            </Box>
        );

        switch (creditData.loanType) {
            case 'Primera Vivienda': // case first property 
                return (
                    <Box sx={{ mt: 3 }}>
                        <Typography variant="h6" sx={{ mb: 2, color: '#22c55e' }}>
                            Documentos Requeridos - Primera Vivienda
                        </Typography>
                        {renderFileButton("Comprobante de Ingresos", incomeProofPdf, setIncomeProofPdf, <MonetizationOnIcon />)}
                        {renderFileButton("Certificado de Avalúo", propertyValuationPdf, setPropertyValuationPdf, <HomeIcon />)}
                        {renderFileButton("Historial Crediticio", creditHistoryPdf, setCreditHistoryPdf, <DescriptionIcon />)}
                    </Box>
                );
            case 'Segunda Vivienda': // case second property
                return (
                    <Box sx={{ mt: 3 }}>
                        <Typography variant="h6" sx={{ mb: 2, color: '#22c55e' }}>
                            Documentos Requeridos - Segunda Vivienda
                        </Typography>
                        {renderFileButton("Comprobante de Ingresos", incomeProofPdf, setIncomeProofPdf, <MonetizationOnIcon />)}
                        {renderFileButton("Certificado de Avalúo", propertyValuationPdf, setPropertyValuationPdf, <HomeIcon />)}
                        {renderFileButton("Escritura Primera Vivienda", firstPropertyDeedPdf, setFirstPropertyDeedPdf, <DescriptionIcon />)}
                        {renderFileButton("Historial Crediticio", creditHistoryPdf, setCreditHistoryPdf, <DescriptionIcon />)}
                    </Box>
                );
            case 'Propiedades Comerciales': // case commercial properties
                return (
                    <Box sx={{ mt: 3 }}>
                        <Typography variant="h6" sx={{ mb: 2, color: '#22c55e' }}>
                            Documentos Requeridos - Propiedades Comerciales
                        </Typography>
                        {renderFileButton("Estado Financiero", financialStateBusinessPdf, setFinancialStateBusinessPdf, <ShoppingBagIcon />)}
                        {renderFileButton("Comprobante de Ingresos", incomeProofPdf, setIncomeProofPdf, <MonetizationOnIcon />)}
                        {renderFileButton("Certificado de Avalúo", propertyValuationPdf, setPropertyValuationPdf, <HomeIcon />)}
                        {renderFileButton("Plan de Negocios", businessPlanPdf, setBusinessPlanPdf, <DescriptionIcon />)}
                    </Box>
                );
            case 'Remodelación': // case renovation 
                return (
                    <Box sx={{ mt: 3 }}>
                        <Typography variant="h6" sx={{ mb: 2, color: '#22c55e' }}>
                            Documentos Requeridos - Remodelación
                        </Typography>
                        {renderFileButton("Comprobante de Ingresos", incomeProofPdf, setIncomeProofPdf, <MonetizationOnIcon />)}
                        {renderFileButton("Presupuesto Remodelación", renovationBudgetPdf, setRenovationBudgetPdf, <DescriptionIcon />)}
                        {renderFileButton("Certificado de Avalúo", propertyValuationPdf, setPropertyValuationPdf, <HomeIcon />)}
                    </Box>
                );
            default:
                return (
                    <Typography variant="h6" sx={{ mt: 3, color: 'text.secondary' }}>
                        Seleccione un tipo de préstamo para ver los documentos requeridos
                    </Typography>
                );
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();

        Object.keys(creditData).forEach(key => {
            formData.append(key, creditData[key].toString());
        });

        // add initial status
        formData.append('status', 'in initial review');

        // add the files to the form data
        if (incomeProofPdf) formData.append('incomeProofPdf', incomeProofPdf);
        if (propertyValuationPdf) formData.append('propertyValuationPdf', propertyValuationPdf);
        if (creditHistoryPdf) formData.append('creditHistoryPdf', creditHistoryPdf);

        switch (creditData.loanType) {
            case 'Segunda Vivienda':
                if (firstPropertyDeedPdf) formData.append('firstPropertyDeedPdf', firstPropertyDeedPdf);
                break;
            case 'Propiedades Comerciales':
                if (financialStateBusinessPdf) formData.append('financialStateBusinessPdf', financialStateBusinessPdf);
                if (businessPlanPdf) formData.append('businessPlanPdf', businessPlanPdf);
                break;
            case 'Remodelación':
                if (renovationBudgetPdf) formData.append('renovationBudgetPdf', renovationBudgetPdf);
                break;
        }

        try {
            const response = await creditRequestService.createCreditRequest(formData);
            setMessage('Solicitud enviada exitosamente');
            setActiveStep(3);
        } catch (error) {
            console.error('Error al enviar la solicitud:', error);
            setMessage('Error al enviar la solicitud: ' + (error.response?.data?.message || error.message));
        }
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
        <Box sx={{ width: '100%', maxWidth: 800, mx: 'auto', p: 3 }}>
            <Paper elevation={3} sx={{ p: 3, backgroundColor: 'white' }}>
                <Typography variant="h5" align="center" gutterBottom sx={{ color: '#22c55e', fontWeight: 'bold' }}>
                    Solicitud de Crédito Hipotecario
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

                {message && (
                    <Alert
                        severity={message.includes('exitosamente') ? "success" : "error"}
                        sx={{ mb: 2 }}
                    >
                        {message}
                    </Alert>
                )}

                {activeStep === 0 && (
                    <Box sx={{ mt: 2 }}>
                        <Typography variant="h6" sx={{ mb: 2 }}>Ingrese su RUT:</Typography>
                        <form onSubmit={handleRutSubmit}>
                            <TextField
                                label="RUT"
                                placeholder="Ej: 99.999.999"
                                value={rut}
                                onChange={(e) => setRut(e.target.value)}
                                fullWidth
                                margin="normal"
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <PersonIcon />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            <Button
                                type="submit"
                                variant="contained"
                                fullWidth
                                sx={{ ...buttonStyles.green, mt: 2 }}
                            >
                                Continuar
                            </Button>
                        </form>
                    </Box>
                )}



                {activeStep === 1 && (
                    <Box sx={{ mt: 2 }}>
                        <form>
                            <TextField
                                label="Gastos Mensuales"
                                placeholder="Ej: 500000"
                                name="expenses"
                                value={creditData.expenses}
                                onChange={handleChange}
                                type="number"
                                fullWidth
                                margin="normal"
                                error={!!validationErrors.expenses}
                                helperText={validationErrors.expenses}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <MonetizationOnIcon />
                                        </InputAdornment>
                                    ),
                                }}
                            />

                            <FormControl fullWidth margin="normal" error={!!validationErrors.loanTypeId}>
                                <InputLabel>Tipo de Préstamo</InputLabel>
                                <Select
                                    name="loanTypeId"
                                    value={creditData.loanTypeId}
                                    onChange={handleChange}
                                    label="Tipo de Préstamo"
                                >
                                    {loanTypes.map((type) => (
                                        <MenuItem key={type.id} value={type.id}>
                                            {type.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                                {validationErrors.loanTypeId && (
                                    <Typography color="error" variant="caption">
                                        {validationErrors.loanTypeId}
                                    </Typography>
                                )}
                            </FormControl>

                            <TextField
                                label="Monto Solicitado"
                                placeholder="Ej: 1000000"
                                name="requestedAmount"
                                value={creditData.requestedAmount}
                                onChange={handleChange}
                                type="number"
                                fullWidth
                                margin="normal"
                                error={!!validationErrors.requestedAmount}
                                helperText={validationErrors.requestedAmount}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <MonetizationOnIcon />
                                        </InputAdornment>
                                    ),
                                }}
                            />

                            <TextField
                                label="Plazo en Años"
                                placeholder="Ej: 5"
                                name="termYears"
                                value={creditData.termYears}
                                onChange={handleChange}
                                type="number"
                                fullWidth
                                margin="normal"
                                error={!!validationErrors.termYears}
                                helperText={validationErrors.termYears}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <AccessTimeIcon />
                                        </InputAdornment>
                                    ),
                                }}
                            />

                            <TextField
                                label="Tasa de Interés"
                                placeholder="Ej: 7.5"
                                name="interestRate"
                                value={creditData.interestRate}
                                onChange={handleChange}
                                type="number"
                                fullWidth
                                margin="normal"
                                error={!!validationErrors.interestRate}
                                helperText={validationErrors.interestRate}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <PercentIcon />
                                        </InputAdornment>
                                    ),
                                }}
                            />

                            <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
                                <Button
                                    onClick={handleBack}
                                    variant="contained"
                                    fullWidth
                                    sx={buttonStyles.red}
                                >
                                    Volver
                                </Button>
                                <Button
                                    onClick={handleNext}
                                    variant="contained"
                                    fullWidth
                                    sx={buttonStyles.green}
                                >
                                    Continuar
                                </Button>
                            </Box>
                        </form>
                    </Box>
                )}

                {activeStep === 2 && (
                    <Box sx={{ mt: 2 }}>
                        {renderDocumentFields()}
                        <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
                            <Button
                                onClick={handleBack}
                                variant="contained"
                                fullWidth
                                sx={buttonStyles.red}
                            >
                                Volver
                            </Button>
                            <Button
                                onClick={handleSubmit}
                                variant="contained"
                                fullWidth
                                sx={buttonStyles.green}
                            >
                                Enviar Solicitud
                            </Button>
                        </Box>
                    </Box>
                )}

                {activeStep === 3 && (
                    <Box sx={{ mt: 2, textAlign: 'center' }}>
                        <Typography variant="h6" sx={{ color: '#22c55e', mb: 2 }}>
                            ¡Solicitud Enviada Exitosamente!
                        </Typography>
                        <Typography variant="body1" sx={{ mb: 3 }}>
                            Resumen de la solicitud:
                        </Typography>
                        <Box sx={{ mb: 3 }}>
                            <Typography><strong>Monto Solicitado:</strong> {formatCurrency(creditData.requestedAmount)}</Typography>
                            <Typography><strong>Plazo:</strong> {creditData.termYears} años</Typography>
                            <Typography><strong>Tipo de Préstamo:</strong> {creditData.loanType}</Typography>
                        </Box>
                        <Button
                            variant="contained"
                            onClick={() => window.location.reload()}
                            sx={buttonStyles.green}
                        >
                            Nueva Solicitud
                        </Button>
                    </Box>
                )}
            </Paper>
        </Box>
    );
};

export default AddCreditRequest;