import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  TextField,
  Button,
  Typography,
  FormControlLabel,
  Switch,
  Paper,
  Grid,
  Stepper,
  Step,
  StepLabel,
  Container,
  Alert,
  CircularProgress
} from '@mui/material';
import loanService from '../services/loan.service';
import clientService from '../services/client.service';
import axios from 'axios';

const EvaluateCreditRequest = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [creditRequest, setCreditRequest] = useState(null);
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [resultMessage, setResultMessage] = useState('');
  const [evaluationData, setEvaluationData] = useState({
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

  // steps (paso 1: info, paso 2: detalles, paso 3: documentación, paso 4: evaluacion)
  const steps = [
    'Información del Cliente',
    'Detalles del Préstamo',
    'Documentación',
    'Evaluación'
  ];

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const loanResponse = await loanService.getLoanById(id);
        setCreditRequest(loanResponse.data);

        const clientResponse = await clientService.getClientById(loanResponse.data.clientId);
        setClient(clientResponse.data);
        setError(null);
      } catch (error) {
        console.error('Error al obtener datos', error);
        setError('Error al cargar los datos. Por favor, intentalo de nuevo');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  // calculate the monthly payment based on the credit request data (requestedAmount, interestRate, termYears)
  const calculateMonthlyPayment = () => {
    if (!creditRequest) return 0;
    const { requestedAmount, interestRate, termYears } = creditRequest;

    if (!requestedAmount || !interestRate || !termYears) {
      return 0;
    }

    const monthlyInterestRate = interestRate / 12 / 100;
    const totalPayments = termYears * 12;
    const payment = (requestedAmount * monthlyInterestRate) /
      (1 - Math.pow(1 + monthlyInterestRate, -totalPayments));

    return isNaN(payment) ? 0 : payment;
  };

  // calculate the payment to income ratio
  const calculatePaymentToIncomeRatio = () => {
    if (!client || !creditRequest) return 0;
    const monthlyIncome = client.salary;
    const monthlyPayment = calculateMonthlyPayment();
    return monthlyIncome ? (monthlyPayment / monthlyIncome) * 100 : 0;
  };

  const calculateDebtToIncomeRatio = () => {
    if (!client || !creditRequest) return 0;
    const monthlyIncome = client.salary;
    const monthlyPayment = calculateMonthlyPayment();
    const expenses = creditRequest.expenses || 0;

    if (!monthlyIncome) return 0;
    const totalDebt = expenses + monthlyPayment;
    return (totalDebt / monthlyIncome) * 100;
  };

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleEvaluate = async () => {
    try {
      const dataToSend = {
        ...evaluationData,
        idCreditRequest: creditRequest.idCreditRequest,
      };

      const response = await loanService.evaluateLoan(id, dataToSend);
      setResultMessage(response.data);
    } catch (error) {
      console.error('Error al evaluar el préstamo', error);
      setError('Error al evaluar el préstamo. Por favor, intente nuevamente.');
    }
  };

  const NavigationButtons = () => (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
      <Button
        variant="contained"
        disabled={activeStep === 0}
        onClick={handleBack}
        sx={{ mr: 1 }}>
        Volver
      </Button>
      <Button
        variant="contained"
        onClick={activeStep === steps.length - 1 ? handleEvaluate : handleNext}>
        {activeStep === steps.length - 1 ? 'Evaluar' : 'Continuar'}
      </Button>
    </Box>
  );

  // step 1: client information: view the resume of the client data
  const ClientInformation = () => (
    <Box>
      <Typography variant="h6" gutterBottom>
        Información del Cliente
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <TextField
            label="Nombre"
            value={client.name}
            fullWidth
            disabled
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            label="Edad"
            value={client.age}
            fullWidth
            disabled
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            label="Salario Mensual"
            value={client.salary}
            fullWidth
            disabled
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            label="Gastos Mensuales"
            value={creditRequest.expenses}
            fullWidth
            disabled
          />
        </Grid>
      </Grid>
    </Box>
  );

  // step 2: loan information: view the resume of the loan data
  const LoanInformation = () => (
    <Box>
      <Typography variant="h6" gutterBottom>
        Información del Préstamo
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <TextField
            label="Monto Solicitado"
            value={creditRequest.requestedAmount}
            fullWidth
            disabled
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            label="Plazo (Años)"
            value={creditRequest.termYears}
            fullWidth
            disabled
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            label="Tasa de Interés (%)"
            value={creditRequest.interestRate}
            fullWidth
            disabled
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            label="Edad al Finalizar el Préstamo"
            value={client.age + creditRequest.termYears}
            fullWidth
            disabled
          />
        </Grid>
      </Grid>
    </Box>
  );

  // step 3: documentation: view the required documentation and download the files
  const Documentation = () => {
    const handleViewDocument = async (documentType) => {
      try {
        const response = await axios.get(
          `http://172.31.118.216:30771/api/v1/request/${id}/${documentType}`,
          { responseType: 'blob' }
        );
        const file = new Blob([response.data], { type: 'application/pdf' });
        const fileURL = URL.createObjectURL(file);
        const link = document.createElement('a');
        link.href = fileURL;
        link.download = `${documentType}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(fileURL);
      } catch (error) {
        console.error('Error al descargar el documento', error);
        setError('Error al descargar el documento. Por favor, intente nuevamente.');
      }
    };

    // render the required documentation based on the loan type
    return (
      <Box>
        <Typography variant="h6" gutterBottom>
          Documentación Requerida
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Button
            variant="outlined"
            onClick={() => handleViewDocument('incomeProofPdf')}>
            Comprobante de Ingresos
          </Button>

          {['Primera Vivienda', 'Segunda Vivienda', 'Remodelación', 'Propiedades Comerciales']
            .includes(creditRequest.loanType) && (
              <Button
                variant="outlined"
                onClick={() => handleViewDocument('propertyValuationPdf')}>
                Tasación de la Propiedad
              </Button>
            )}

          {['Primera Vivienda', 'Segunda Vivienda'].includes(creditRequest.loanType) && (
            <Button
              variant="outlined"
              onClick={() => handleViewDocument('creditHistoryPdf')}>
              Historial Crediticio
            </Button>
          )}

          {creditRequest.loanType === 'Segunda Vivienda' && (
            <Button
              variant="outlined"
              onClick={() => handleViewDocument('firstPropertyDeedPdf')}>
              Escritura de la Primera Propiedad
            </Button>
          )}

          {creditRequest.loanType === 'Propiedades Comerciales' && (
            <>
              <Button
                variant="outlined"
                onClick={() => handleViewDocument('businessPlanPdf')}>
                Plan de Negocios
              </Button>
              <Button
                variant="outlined"
                onClick={() => handleViewDocument('financialStateBusinessPdf')}>
                Estado Financiero del Negocio
              </Button>
            </>
          )}

          {creditRequest.loanType === 'Remodelación' && (
            <Button
              variant="outlined"
              onClick={() => handleViewDocument('renovationBudgetPdf')}
            >
              Presupuesto de Renovación
            </Button>
          )}
        </Box>
      </Box>
    );
  };


  // step 4: evaluation: view the evaluation rules and results
  const Evaluation = () => {
    const handleSwitchChange = (event) => {
      const { name, checked } = event.target;
      setEvaluationData({ ...evaluationData, [name]: checked });
    };

    return (
      <Box>
        <Typography variant="h6" gutterBottom>
          Evaluación de Reglas
        </Typography>

        {/* R1,R2,R3,R4 */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="subtitle1" gutterBottom sx={{ color: 'primary.main' }}>
            Reglas Financieras Básicas
          </Typography>

          {/* R1 */}
          <Box sx={{ mb: 2 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={evaluationData.r1PaymentToIncome}
                  onChange={handleSwitchChange}
                  name="r1PaymentToIncome"
                  color="primary"
                />
              }
              label={`R1: Relación Cuota/Ingreso (${calculatePaymentToIncomeRatio().toFixed(2)}%)`}
            />
            <Typography variant="body2" sx={{ ml: 4, color: 'text.secondary' }}>
              La relación cuota/ingreso debe ser menor o igual al 25%.
            </Typography>
          </Box>

          {/* R2 */}
          <Box sx={{ mb: 2 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={evaluationData.r2CreditHistory}
                  onChange={handleSwitchChange}
                  name="r2CreditHistory"
                  color="primary"
                />
              }
              label="R2: Historial Crediticio del Cliente"
            />
            <Typography variant="body2" sx={{ ml: 4, color: 'text.secondary' }}>
              El cliente no debe tener morosidades en el sistema financiero.
            </Typography>
          </Box>

          {/* R3 */}
          <Box sx={{ mb: 2 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={evaluationData.r3EmploymentStability}
                  onChange={handleSwitchChange}
                  name="r3EmploymentStability"
                  color="primary"
                />
              }
              label="R3: Antigüedad Laboral y Estabilidad"
            />
            <Typography variant="body2" sx={{ ml: 4, color: 'text.secondary' }}>
              El cliente debe tener al menos 1 año de antigüedad en su empleo actual.
            </Typography>
          </Box>

          {/* R4 */}
          <Box sx={{ mb: 2 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={evaluationData.r4DebtToIncome}
                  onChange={handleSwitchChange}
                  name="r4DebtToIncome"
                  color="primary"
                />
              }
              label={`R4: Relación Deuda/Ingreso (${calculateDebtToIncomeRatio().toFixed(2)}%)`} />
            <Typography variant="body2" sx={{ ml: 4, color: 'text.secondary' }}>
              La relación deuda/ingreso debe ser menor o igual al 40%.
            </Typography>
          </Box>
        </Box>

        {/* R5, R6 */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="subtitle1" gutterBottom sx={{ color: 'primary.main' }}>
            Reglas del Préstamo
          </Typography>

          {/* R5 */}
          <Box sx={{ mb: 2 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={evaluationData.r5MaxFinancing}
                  onChange={handleSwitchChange}
                  name="r5MaxFinancing"
                  color="primary"
                />
              }
              label="R5: Monto Máximo de Financiamiento" />
            <Typography variant="body2" sx={{ ml: 4, color: 'text.secondary' }}>
              El monto solicitado no debe exceder el monto máximo permitido para este tipo de préstamo.
            </Typography>
          </Box>

          {/* R6 */}
          <Box sx={{ mb: 2 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={evaluationData.r6AgeRestriction}
                  onChange={handleSwitchChange}
                  name="r6AgeRestriction"
                  color="primary"
                />
              }
              label={`R6: Edad al finalizar el préstamo (${client.age + creditRequest.termYears} años)`}
            />
            <Typography variant="body2" sx={{ ml: 4, color: 'text.secondary' }}>
              La edad del cliente al finalizar el préstamo no debe superar los 75 años.
            </Typography>
          </Box>
        </Box>

        {/* R7 */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="subtitle1" gutterBottom sx={{ color: 'primary.main' }}>
            R7: Capacidad de Ahorro
          </Typography>

          {/* R71 */}
          <Box sx={{ mb: 2, ml: 2 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={evaluationData.r71MinimumBalance}
                  onChange={handleSwitchChange}
                  name="r71MinimumBalance"
                  color="primary"
                />
              }
              label="R71: Saldo Mínimo Requerido"
            />
            <Typography variant="body2" sx={{ ml: 4, color: 'text.secondary' }}>
              El cliente debe mantener un saldo mínimo en su cuenta de ahorros.
            </Typography>
          </Box>

          {/* R72 */}
          <Box sx={{ mb: 2, ml: 2 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={evaluationData.r72ConsistentSavingsHistory}
                  onChange={handleSwitchChange}
                  name="r72ConsistentSavingsHistory"
                  color="primary"
                />
              }
              label="R72: Historial de Ahorro Consistente"
            />
            <Typography variant="body2" sx={{ ml: 4, color: 'text.secondary' }}>
              El cliente debe tener un historial consistente de ahorro durante los últimos 12 meses.
            </Typography>
          </Box>

          {/* R73 */}
          <Box sx={{ mb: 2, ml: 2 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={evaluationData.r73PeriodicDeposits}
                  onChange={handleSwitchChange}
                  name="r73PeriodicDeposits"
                  color="primary"
                />
              }
              label="R73: Depósitos Periódicos"
            />
            <Typography variant="body2" sx={{ ml: 4, color: 'text.secondary' }}>
              El cliente realiza depósitos periódicos en su cuenta de ahorros.
            </Typography>
          </Box>

          {/* R74 */}
          <Box sx={{ mb: 2, ml: 2 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={evaluationData.r74BalanceYearsRatio}
                  onChange={handleSwitchChange}
                  name="r74BalanceYearsRatio"
                  color="primary"
                />
              }
              label="R74: Relación Saldo/Años de Antigüedad"
            />
            <Typography variant="body2" sx={{ ml: 4, color: 'text.secondary' }}>
              La relación entre el saldo de la cuenta y los años de antigüedad es aceptable.
            </Typography>
          </Box>

          {/* R75 */}
          <Box sx={{ mb: 2, ml: 2 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={evaluationData.r75RecentWithdrawals}
                  onChange={handleSwitchChange}
                  name="r75RecentWithdrawals"
                  color="primary"
                />
              }
              label="R75: Retiros Recientes"
            />
            <Typography variant="body2" sx={{ ml: 4, color: 'text.secondary' }}>
              El cliente no ha realizado retiros significativos en los últimos 3 meses.
            </Typography>
          </Box>
        </Box>

        {/* Resuls resume */}
        {resultMessage && (
          <Box sx={{ mt: 3, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
            <Typography variant="h6" color="primary" gutterBottom>
              Resultado de la Evaluación
            </Typography>
            <Typography variant="body1">
              {resultMessage}
            </Typography>
          </Box>
        )}
      </Box>
    );
  };

  // step resume:: (0,1,2,3)
  const StepContent = () => {
    switch (activeStep) {
      case 0:
        return <ClientInformation />;
      case 1:
        return <LoanInformation />;
      case 2:
        return <Documentation />;
      case 3:
        return <Evaluation />;
      default:
        return null;
    }
  };

  // return buttons and resume

  return (
    <Container maxWidth="lg">
      <Paper sx={{ padding: '20px', margin: '20px auto' }}>
        <Typography variant="h4" gutterBottom>
          Evaluar Solicitud de Crédito #{id}
        </Typography>
      
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {!creditRequest || !client ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <Typography variant="h6">Cargando datos...</Typography>
          </Box>
        ) : (
          <Box>
            <StepContent />

            <Box sx={{ mt: 4, mb: 2 }}>
              <NavigationButtons />
            </Box>
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default EvaluateCreditRequest;