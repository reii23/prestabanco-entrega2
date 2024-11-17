import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import ClientList from "./components/ClientList";
import AddEditClient from "./components/AddEditClient";
import CreditSimulation from "./components/CreditSimulation";
import LoanList from "./components/LoanList";
import AddCreditRequest from "./components/AddCreditRequest";
import LoanCostView from './components/LoanCostView';
import CreditStatusView from './components/CreditStatusView';
import EvaluateCreditRequest from './components/EvaluateCreditRequest';
import Sidebar from "./components/Sidebar";
import Box from "@mui/material/Box";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Typography from "@mui/material/Typography";



const App = () => {
  const [open, setOpen] = useState(false);

  const toggleDrawer = (isOpen) => (event) => {
    setOpen(isOpen);
  };

  return (
    <Router>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
              onClick={toggleDrawer(true)}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Sistema de Gestión de Créditos
            </Typography>
          </Toolbar>
        </AppBar>

        <Sidebar open={open} toggleDrawer={toggleDrawer} />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/clients" element={<ClientList />} />
          <Route path="/clients/add" element={<AddEditClient />} />
          <Route path="/clients/edit/:id" element={<AddEditClient />} />
          <Route path="/credit-simulation" element={<CreditSimulation />} />
          <Route path="/loans" element={<LoanList />} /> 
          <Route path="/loans/add" element={<AddCreditRequest />} />
          <Route path="/creditstatus" element={<CreditStatusView />} />
          <Route path="/loan-cost" element={<LoanCostView />} />
          <Route path="/loans/evaluate/:id" element={<EvaluateCreditRequest />} />

        </Routes>
      </Box>
    </Router>
  );
};

export default App;
