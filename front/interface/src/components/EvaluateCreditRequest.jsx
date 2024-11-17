import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box, TextField, Button, Typography, FormControlLabel, Switch, Paper, Grid
} from '@mui/material';
import loanService from '../services/loan.service';
import clientService from '../services/client.service';
import axios from 'axios';



// component to evaluate a credit request
const EvaluateCreditRequest = () => {
  const { id } = useParams();
  const [creditRequest, setCreditRequest] = useState(null);
  const [client, setClient] = useState(null);
  const [evaluationData, setEvaluationData] = useState({

    // set all evaluation data to false by default (evaluation rules)
    r1PaymentToIncome: false,
    r2CreditHistory: false,
    r3EmploymentStability: false,
    r4DebtToIncome: false,
    r5MaxFinancing: false,
    r6AgeRestriction: false,
    r71MinimumBalance: false,
    r72ConsistentSavingsHistory: false,
    r73PeriodicDeposits: false,
    r74BalanceYearsRatio: false,
    r75RecentWithdrawals: false,
  });
  const [resultMessage, setResultMessage] = useState('');


  // fetch credit request and client data by id
  useEffect(() => {
    const fetchData = async () => {
      try {
        const loanResponse = await loanService.getLoanById(id);
        console.log('Loan Data:', loanResponse.data);
        setCreditRequest(loanResponse.data);

        const clientResponse = await clientService.getClientById(loanResponse.data.clientId);
        console.log('Client Data:', clientResponse.data);
        setClient(clientResponse.data);
      } catch (error) {
        // log an error if the data cannot be fetched
        console.error('Error al obtener datos', error);
      }
    };
    fetchData();
  }, [id]);

  // calculate the monthly payment based on the credit request data (requestedAmount, interestRate, termYears)
  const calculateMonthlyPayment = () => {
    if (!creditRequest) return 0;
    const { requestedAmount, interestRate, termYears } = creditRequest;

    if (
      requestedAmount == null ||
      interestRate == null ||
      termYears == null ||
      isNaN(requestedAmount) ||
      isNaN(interestRate) ||
      isNaN(termYears)
    ) {

      // log an error if the data is invalid
      console.error('Datos inválidos para el cálculo del pago mensual');
      return 0;
    }

    // calculate the monthly interest rate and total payments
    const monthlyInterestRate = interestRate / 12 / 100; // monthly interest rate
    const totalPayments = termYears * 12; // total payments
    const payment = (requestedAmount * monthlyInterestRate) / (1 - Math.pow(1 + monthlyInterestRate, -totalPayments)); // monthly payment

    // log an error if the payment calculation fails
    if (isNaN(payment)) {
      console.error('Error en el cálculo del pago mensual');
      return 0;
    }
    return payment;
  };

  // calculate the payment to income ratio
  const calculatePaymentToIncomeRatio = () => {
    if (!client || !creditRequest) return 0;
    const monthlyIncome = client.salary;
    const monthlyPayment = calculateMonthlyPayment();

    // check if the data is valid (not null, not NaN, not 0)
    if (
      monthlyIncome == null ||
      isNaN(monthlyIncome) ||
      monthlyPayment == null ||
      isNaN(monthlyPayment) ||
      monthlyIncome === 0
    ) {
      console.error('Datos inválidos para el cálculo de la relación cuota/ingreso');
      return 0;
    }

    return (monthlyPayment / monthlyIncome) * 100; // calculate the payment to income ratio
  };


  // calculate the debt to income ratio
  const calculateDebtToIncomeRatio = () => {
    if (!client || !creditRequest) return 0;
    const monthlyIncome = client.salary;
    const monthlyPayment = calculateMonthlyPayment();
    const expenses = creditRequest.expenses || 0;

    if (
      monthlyIncome == null ||
      isNaN(monthlyIncome) ||
      monthlyPayment == null ||
      isNaN(monthlyPayment) ||
      isNaN(expenses) ||
      monthlyIncome === 0
    ) {
      console.error('Datos inválidos para el cálculo de la relación deuda/ingreso');
      return 0;
    }

    const totalDebt = expenses + monthlyPayment;
    return (totalDebt / monthlyIncome) * 100; // calculate the debt to income ratio
  };

  // handle the switch change event
  const handleSwitchChange = (event) => {
    const { name, checked } = event.target;
    setEvaluationData({ ...evaluationData, [name]: checked });
  };

  const handleEvaluate = async () => {
    try {
      const dataToSend = {
        ...evaluationData,
        idCreditRequest: creditRequest.idCreditRequest,
      };

      const response = await loanService.evaluateLoan(id, dataToSend);
      setResultMessage(response.data);
    } catch (error) { // log an error if the evaluation fails
      console.error('Error al evaluar el préstamo', error);
    }
  };

  // handle to download and view the document
  const handleViewDocument = async (documentType) => {
    try {
      const response = await axios.get(
        `http://prestabanco-app.brazilsouth.cloudapp.azure.com:80/api/v1/CreditRequest/${id}/${documentType}`,
        { responseType: 'blob' }
      );

      // create a Blob object with the response data
      const file = new Blob([response.data], { type: 'application/pdf' });
      const fileURL = URL.createObjectURL(file);

      const link = document.createElement('a');
      link.href = fileURL;
      link.download = `${documentType}.pdf`; // Establece el nombre del archivo descargado
      document.body.appendChild(link); // Agrega el enlace al DOM
      link.click(); // Activa el clic en el enlace
      document.body.removeChild(link); // Elimina el enlace del DOM después de descargar

      URL.revokeObjectURL(fileURL);
    } catch (error) {
      console.error('Error al descargar el documento', error);
      alert('El documento no está disponible.');
    }
  };

  // render the component (evaluate credit request)
  return (
    creditRequest && client ? (
      <Paper sx={{ padding: '20px', margin: '20px auto', maxWidth: '800px' }}>
        <Typography variant="h4" gutterBottom>
          Evaluar Solicitud de Crédito #{id}
        </Typography>

        {/* Client information: show the client information */}
        <Box sx={{ marginTop: '20px' }}>
          <Typography variant="h6">Información del Cliente</Typography>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                label="Nombre"
                value={client.name}
                fullWidth
                disabled
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Edad"
                value={client.age}
                fullWidth
                disabled
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Salario Mensual"
                value={client.salary}
                fullWidth
                disabled
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Gastos Mensuales"
                value={creditRequest.expenses}
                fullWidth
                disabled
              />
            </Grid>
          </Grid>
        </Box>

        {/* Loan information: show the loan information */}
        <Box sx={{ marginTop: '20px' }}>
          <Typography variant="h6">Información del Préstamo</Typography>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                label="Monto Solicitado"
                value={creditRequest.requestedAmount}
                fullWidth
                disabled
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Plazo (Años)"
                value={creditRequest.termYears}
                fullWidth
                disabled
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Tasa de Interés (%)"
                value={creditRequest.interestRate}
                fullWidth
                disabled
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Edad al Finalizar el Préstamo"
                value={client.age + creditRequest.termYears}
                fullWidth
                disabled
              />
            </Grid>
          </Grid>
        </Box>

        {/* Documentation: show the documentation */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px' }}>
          <Button variant="outlined" onClick={() => handleViewDocument('incomeProofPdf')}>
            Descargar Comprobante de Ingresos
          </Button>

          {['Primera Vivienda', 'Segunda Vivienda', 'Remodelación', 'Propiedades Comerciales'].includes(creditRequest.loanType) && (
            <Button variant="outlined" onClick={() => handleViewDocument('propertyValuationPdf')}>
              Descargar Tasación de la Propiedad
            </Button>
          )}

          {['Primera Vivienda', 'Segunda Vivienda'].includes(creditRequest.loanType) && (
            <Button variant="outlined" onClick={() => handleViewDocument('creditHistoryPdf')}>
              Descargar Historial Crediticio
            </Button>
          )}

          {creditRequest.loanType === 'Segunda Vivienda' && (
            <Button variant="outlined" onClick={() => handleViewDocument('firstPropertyDeedPdf')}>
              Descargar Escritura de la Primera Propiedad
            </Button>
          )}

          {creditRequest.loanType === 'Propiedades Comerciales' && (
            <>
              <Button variant="outlined" onClick={() => handleViewDocument('businessPlanPdf')}>
                Descargar Plan de Negocios
              </Button>
              <Button variant="outlined" onClick={() => handleViewDocument('financialStateBusinessPdf')}>
                Descargar Estado Financiero del Negocio
              </Button>
            </>
          )}

          {creditRequest.loanType === 'Remodelación' && (
            <Button variant="outlined" onClick={() => handleViewDocument('renovationBudgetPdf')}>
              Descargar Presupuesto de Renovación
            </Button>
          )}
        </Box>

        {/* Evaluation rules  */}
        <Box sx={{ marginTop: '20px' }}>
          <Typography variant="h6">Evaluación de Reglas</Typography>

          {/* R1 */}
          <Box sx={{ marginTop: '10px' }}>
            <FormControlLabel
              control={
                <Switch
                  checked={evaluationData.r1PaymentToIncome}
                  onChange={handleSwitchChange}
                  name="r1PaymentToIncome"
                />
              }
              label={`R1: Relación Cuota/Ingreso (${calculatePaymentToIncomeRatio().toFixed(2)}%)`}
            />
            <Typography variant="body2" sx={{ marginLeft: '32px' }}>
              La relación cuota/ingreso debe ser menor o igual al 25%.
            </Typography>
          </Box>

          {/* R2 */}
          <Box sx={{ marginTop: '10px' }}>
            <FormControlLabel
              control={
                <Switch
                  checked={evaluationData.r2CreditHistory}
                  onChange={handleSwitchChange}
                  name="r2CreditHistory"
                />
              }
              label="R2: Historial Crediticio del Cliente"
            />
            <Typography variant="body2" sx={{ marginLeft: '32px' }}>
              El cliente no debe tener morosidades en el sistema financiero.
            </Typography>
          </Box>

          {/* R3 */}
          <Box sx={{ marginTop: '10px' }}>
            <FormControlLabel
              control={
                <Switch
                  checked={evaluationData.r3EmploymentStability}
                  onChange={handleSwitchChange}
                  name="r3EmploymentStability"
                />
              }
              label="R3: Antigüedad Laboral y Estabilidad"
            />
            <Typography variant="body2" sx={{ marginLeft: '32px' }}>
              El cliente debe tener al menos 1 año de antigüedad en su empleo actual.
            </Typography>
          </Box>

          {/* R4*/}
          <Box sx={{ marginTop: '10px' }}>
            <FormControlLabel
              control={
                <Switch
                  checked={evaluationData.r4DebtToIncome}
                  onChange={handleSwitchChange}
                  name="r4DebtToIncome"
                />
              }
              label={`R4: Relación Deuda/Ingreso (${calculateDebtToIncomeRatio().toFixed(2)}%)`}
            />
            <Typography variant="body2" sx={{ marginLeft: '32px' }}>
              La relación deuda/ingreso debe ser menor o igual al 40%.
            </Typography>
          </Box>

          {/* R5: */}
          <Box sx={{ marginTop: '10px' }}>
            <FormControlLabel
              control={
                <Switch
                  checked={evaluationData.r5MaxFinancing}
                  onChange={handleSwitchChange}
                  name="r5MaxFinancing"
                />
              }
              label="R5: Monto Máximo de Financiamiento"
            />
            <Typography variant="body2" sx={{ marginLeft: '32px' }}>
              El monto solicitado no debe exceder el monto máximo permitido para este tipo de préstamo.
            </Typography>
          </Box>

          {/* R6 */}
          <Box sx={{ marginTop: '10px' }}>
            <FormControlLabel
              control={
                <Switch
                  checked={evaluationData.r6AgeRestriction}
                  onChange={handleSwitchChange}
                  name="r6AgeRestriction"
                />
              }
              label={`R6: Edad al finalizar el préstamo (${client.age + creditRequest.termYears} años)`}
            />
            <Typography variant="body2" sx={{ marginLeft: '32px' }}>
              La edad del cliente al finalizar el préstamo no debe superar los 75 años.
            </Typography>
          </Box>

          {/* R7*/}
          <Typography variant="h6" sx={{ marginTop: '20px' }}>R7: Capacidad de Ahorro</Typography>

          <Typography variant="body2" sx={{ marginLeft: '16px', marginBottom: '10px' }}>
            Se evalúan los siguientes criterios para determinar la capacidad de ahorro:
          </Typography>

          {/* R71: minimum balance */}
          <Box sx={{ marginLeft: '16px' }}>
            <FormControlLabel
              control={
                <Switch
                  checked={evaluationData.r71MinimumBalance}
                  onChange={handleSwitchChange}
                  name="r71MinimumBalance"
                />
              }
              label="R71: Saldo Mínimo Requerido"
            />
            <Typography variant="body2" sx={{ marginLeft: '48px' }}>
              El cliente debe mantener un saldo mínimo en su cuenta de ahorros.
            </Typography>
          </Box>

          {/* R72: consistent saving history */}
          <Box sx={{ marginLeft: '16px' }}>
            <FormControlLabel
              control={
                <Switch
                  checked={evaluationData.r72ConsistentSavingsHistory}
                  onChange={handleSwitchChange}
                  name="r72ConsistentSavingsHistory"
                />
              }
              label="R72: Historial de Ahorro Consistente"
            />
            <Typography variant="body2" sx={{ marginLeft: '48px' }}>
              El cliente debe tener un historial consistente de ahorro durante los últimos 12 meses.
            </Typography>
          </Box>

          {/* R73: periodic deposits */}
          <Box sx={{ marginLeft: '16px' }}>
            <FormControlLabel
              control={
                <Switch
                  checked={evaluationData.r73PeriodicDeposits}
                  onChange={handleSwitchChange}
                  name="r73PeriodicDeposits"
                />
              }
              label="R73: Depósitos Periódicos"
            />
            <Typography variant="body2" sx={{ marginLeft: '48px' }}>
              El cliente realiza depósitos periódicos en su cuenta de ahorros.
            </Typography>
          </Box>

          {/* R74: balance ratio in years */}
          <Box sx={{ marginLeft: '16px' }}>
            <FormControlLabel
              control={
                <Switch
                  checked={evaluationData.r74BalanceYearsRatio}
                  onChange={handleSwitchChange}
                  name="r74BalanceYearsRatio"
                />
              }
              label="R74: Relación Saldo/Años de Antigüedad"
            />
            <Typography variant="body2" sx={{ marginLeft: '48px' }}>
              La relación entre el saldo de la cuenta y los años de antigüedad es aceptable.
            </Typography>
          </Box>

          {/* R75: recent withdrawls */}
          <Box sx={{ marginLeft: '16px' }}>
            <FormControlLabel
              control={
                <Switch
                  checked={evaluationData.r75RecentWithdrawals}
                  onChange={handleSwitchChange}
                  name="r75RecentWithdrawals"
                />
              }
              label="R75: Retiros Recientes"
            />
            <Typography variant="body2" sx={{ marginLeft: '48px' }}>
              El cliente no ha realizado retiros significativos en los últimos 3 meses.
            </Typography>
          </Box>

          <Button variant="contained" color="primary" sx={{ marginTop: '20px' }} onClick={handleEvaluate}>
            Evaluar Solicitud
          </Button>

          {resultMessage && (
            <Typography variant="h6" sx={{ marginTop: '20px' }}>
              Resultado: {resultMessage}
            </Typography>
          )}
        </Box>
      </Paper>
    ) : (
      <Typography variant="h6">Cargando datos...</Typography>
    )
  );
};

export default EvaluateCreditRequest;
