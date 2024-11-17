import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, Typography, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import creditRequestService from '../services/creditRequest.service';
import loanTypeService from '../services/loanType.service';

const AddCreditRequest = () => {
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
    const [incomeProofPdf, setIncomeProofPdf] = useState(null);
    const [propertyValuationPdf, setPropertyValuationPdf] = useState(null);
    const [creditHistoryPdf, setCreditHistoryPdf] = useState(null);
    const [firstPropertyDeedPdf, setFirstPropertyDeedPdf] = useState(null);
    const [financialStateBusinessPdf, setFinancialStateBusinessPdf] = useState(null);
    const [renovationBudgetPdf, setRenovationBudgetPdf] = useState(null);
    const [businessPlanPdf, setBusinessPlanPdf] = useState(null);
    const [message, setMessage] = useState('');

    // obtain the list of loan types 
    useEffect(() => {
        const fetchLoanTypes = async () => {
            try {
                const response = await loanTypeService.getAllLoanTypes();
                setLoanTypes(response.data); // save the list of loan types in the state
            } catch (error) {
                console.error("Error getting loan types", error);
            }
        };
        fetchLoanTypes();
    }, []);

    /// search for a client by rut -> to verify if the client exists to create a credit request
    const handleRutSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await creditRequestService.getClientByRut(rut);
            setClient(response.data); // obtain the client data (id) 
            setCreditData({ ...creditData, clientId: response.data.id });
            setMessage('');
        } catch (error) {
            setMessage('Client not found');
            setClient(null);
        }
    };

    // change the value of the fields in the form (expenses, loan type, requested amount, term in years, interest rate) 
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
            setCreditData({
                ...creditData,
                loanTypeId: parseInt(value),
                loanType: selectedLoanType?.name || ''
            });
        } else {
            setCreditData({ ...creditData, [name]: value });
        }
    };
    // change the file to upload (income proof, property valuation, credit history, firstPropertyDeedPdf)
    const handleFileChange = (e, setFile) => {
        setFile(e.target.files[0]);
    };

    // render the fields to upload the required documents according to the selected loan type
    const renderDocumentFields = () => {
        const renderFileButton = (label, file, setFile) => (
            <Box sx={{ my: 2 }}>
                <Button
                    component="label"
                    variant="contained"
                    startIcon={<CloudUploadIcon />}
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
                    <Typography variant="body2" sx={{ mt: 1 }}>
                        Archivo seleccionado: {file.name}
                    </Typography>
                )}
            </Box>
        );

        switch (creditData.loanType) {
            case 'Primera Vivienda': // case first property 
                return (
                    <>
                        <Typography variant="h6">Documentos para Primera Vivienda</Typography>
                        {renderFileButton("Subir Comprobante de Ingresos", incomeProofPdf, setIncomeProofPdf)}
                        {renderFileButton("Subir Certificado de Avalúo", propertyValuationPdf, setPropertyValuationPdf)}
                        {renderFileButton("Subir Historial Crediticio", creditHistoryPdf, setCreditHistoryPdf)}
                    </>
                );
            case 'Segunda Vivienda': // case second property
                return (
                    <>
                        <Typography variant="h6">Documentos para Segunda Vivienda</Typography>
                        {renderFileButton("Subir Comprobante de Ingresos", incomeProofPdf, setIncomeProofPdf)}
                        {renderFileButton("Subir Certificado de Avalúo", propertyValuationPdf, setPropertyValuationPdf)}
                        {renderFileButton("Subir Escritura de la Primera Vivienda", firstPropertyDeedPdf, setFirstPropertyDeedPdf)}
                        {renderFileButton("Subir Historial Crediticio", creditHistoryPdf, setCreditHistoryPdf)}
                    </>
                );
            case 'Propiedades Comerciales': // case commercial properties
                return (
                    <>
                        <Typography variant="h6">Documentos para Propiedades Comerciales</Typography>
                        {renderFileButton("Subir Estado Financiero del Negocio", financialStateBusinessPdf, setFinancialStateBusinessPdf)}
                        {renderFileButton("Subir Comprobante de Ingresos", incomeProofPdf, setIncomeProofPdf)}
                        {renderFileButton("Subir Certificado de Avalúo", propertyValuationPdf, setPropertyValuationPdf)}
                        {renderFileButton("Subir Plan de Negocios", businessPlanPdf, setBusinessPlanPdf)}
                    </>
                );
            case 'Remodelación': // case renovation 
                return (
                    <>
                        <Typography variant="h6">Documentos para Remodelación</Typography>
                        {renderFileButton("Subir Comprobante de Ingresos", incomeProofPdf, setIncomeProofPdf)}
                        {renderFileButton("Subir Presupuesto de la Remodelación", renovationBudgetPdf, setRenovationBudgetPdf)}
                        {renderFileButton("Subir Certificado de Avalúo Actualizado", propertyValuationPdf, setPropertyValuationPdf)}
                    </>
                );
            default:
                return <Typography variant="h6">Por favor seleccione un tipo de préstamo para ver los documentos requeridos.</Typography>;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('clientId', creditData.clientId.toString());
        formData.append('expenses', creditData.expenses.toString());
        formData.append('loanTypeId', creditData.loanTypeId.toString());
        formData.append('loanType', creditData.loanType);
        formData.append('requestedAmount', creditData.requestedAmount.toString());
        formData.append('termYears', creditData.termYears.toString());
        formData.append('interestRate', creditData.interestRate.toString());
        formData.append('status', 'in initial review');
        
        formData.append('incomeProofPdf', incomeProofPdf);
        formData.append('propertyValuationPdf', propertyValuationPdf);
        formData.append('creditHistoryPdf', creditHistoryPdf);

        if (creditData.loanType === 'Segunda Vivienda' && firstPropertyDeedPdf) {
            formData.append('firstPropertyDeedPdf', firstPropertyDeedPdf);
        }

        if (creditData.loanType === 'Propiedades Comerciales' && financialStateBusinessPdf) {
            formData.append('financialStateBusinessPdf', financialStateBusinessPdf);
        }

        if (creditData.loanType === 'Remodelación' && renovationBudgetPdf) {
            formData.append('renovationBudgetPdf', renovationBudgetPdf);
        }

        if (creditData.loanType === 'Propiedades Comerciales' && businessPlanPdf) {
            formData.append('businessPlanPdf', businessPlanPdf);
        }
        


        try {
            const response = await creditRequestService.createCreditRequest(formData);
            console.log('Solicitud enviada exitosamente:', response.data);
            setMessage('Solicitud enviada exitosamente.');
        } catch (error) {
            console.error('Error al enviar la solicitud:', error);
            setMessage('Error al enviar la solicitud: ' + error.response?.data?.message || error.message);
        }
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 4 }}>
            <Typography variant="h4">Solicitar Crédito</Typography>
            {!client ? (
                <form onSubmit={handleRutSubmit} style={{ width: '50%' }}>
                    <TextField
                        label="Ingrese su RUT"
                        name="rut"
                        value={rut}
                        onChange={(e) => setRut(e.target.value)}
                        fullWidth
                        margin="normal"
                    />
                    <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
                        Buscar Cliente
                    </Button>
                </form>
            ) : (
                <form onSubmit={handleSubmit} style={{ width: '50%', marginTop: '2rem' }}>
                    <TextField
                        label="Gastos del Cliente"
                        name="expenses"
                        value={creditData.expenses}
                        onChange={handleChange}
                        type="number"
                        fullWidth
                        margin="normal"
                    />
                    <FormControl fullWidth margin="normal">
                        <InputLabel id="loan-type-label">Tipo de Préstamo</InputLabel>
                        <Select
                            labelId="loan-type-label"
                            name="loanTypeId"
                            value={creditData.loanTypeId || ''} 
                            onChange={handleChange}
                            label="Tipo de Préstamo"
                        >
                            {loanTypes.map((loanType) => (
                                <MenuItem key={loanType.id} value={loanType.id}>
                                    {loanType.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    
                    <TextField
                        label="Monto Solicitado"
                        name="requestedAmount"
                        value={creditData.requestedAmount}
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
                        label="Tasa de Interés"
                        name="interestRate"
                        value={creditData.interestRate}
                        onChange={handleChange}
                        type="number"
                        fullWidth
                        margin="normal"
                    />

                    <Typography variant="h5" sx={{ mt: 3 }}>
                        Documentos Requeridos
                    </Typography>
                    {renderDocumentFields()}

                    <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
                        Enviar Solicitud
                    </Button>
                </form>
            )}

            {message && (
                <Typography variant="h6" sx={{ mt: 4 }}>
                    {message}
                </Typography>
            )}
        </Box>
    );
};

export default AddCreditRequest;
