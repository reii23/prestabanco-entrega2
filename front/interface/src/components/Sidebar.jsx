import React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import HomeIcon from "@mui/icons-material/Home";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import PaymentsIcon from '@mui/icons-material/Payments';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import { useNavigate } from "react-router-dom";

const Sidebar = ({ open, toggleDrawer }) => {
  const navigate = useNavigate();

  const listOptions = () => (
    <Box role="presentation" onClick={toggleDrawer(false)}>
      <List>
        <ListItemButton onClick={() => navigate("/home")}>
          <ListItemIcon>
            <HomeIcon />
          </ListItemIcon>
          <ListItemText primary="Inicio" />
        </ListItemButton>

        {/* Clients Button option */}
        <ListItemButton onClick={() => navigate("/clients")}>
          <ListItemIcon>
            <PeopleAltIcon />
          </ListItemIcon>
          <ListItemText primary="Clientes" />
        </ListItemButton>

        {/* Credit Simulation button option */}
        <ListItemButton onClick={() => navigate("/credit-simulation")}>
          <ListItemIcon>
            <AttachMoneyIcon />
          </ListItemIcon>
          <ListItemText primary="Simulación de Crédito" />
        </ListItemButton>

        {/* Loans Button option */}
        <ListItemButton onClick={() => navigate("/loans")}>
          <ListItemIcon>
            <AccountBalanceIcon />
          </ListItemIcon>
          <ListItemText primary="Solicitudes de Crédito" />
        </ListItemButton>

        {/* Credit Status Button option */}
        <ListItemButton onClick={() => navigate("/creditstatus")}>
          <ListItemIcon>
            <AssignmentTurnedInIcon /> 
          </ListItemIcon>
          <ListItemText primary="Seguimiento de Estado del Crédito" />
        </ListItemButton>

        {/* Credit Status view Button option  */}
        <ListItemButton onClick={() => navigate("/loan-cost")}>
          <ListItemIcon>
            <PaymentsIcon />
          </ListItemIcon>
          <ListItemText primary="Costos Totales del Crédito" />
        </ListItemButton>
      </List>
    </Box>
  );

  return (
    <div>
      <Drawer anchor={"left"} open={open} onClose={toggleDrawer(false)}>
        {listOptions()}
      </Drawer>
    </div>
  );
};

export default Sidebar;
