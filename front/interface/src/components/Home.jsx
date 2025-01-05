import React from "react";
import { 
  Box, 
  Container, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  CardActionArea,
  useTheme 
} from "@mui/material";
import {
  AccountBalance,
  Assessment,
  People,
  BarChart,
  Search,
  Payments
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  const features = [
    {
      title: "Simulación de Crédito",
      description: "Simule su crédito hipotecario o de negocio",
      icon: <BarChart sx={{ fontSize: 40, color: '#22c55e' }} />,
      path: "/credit-simulation"
    },
    {
      title: "Gestión de Clientes",
      description: "Administre la información de los clientes",
      icon: <People sx={{ fontSize: 40, color: '#22c55e' }} />,
      path: "/clients"
    },
    {
      title: "Solicitudes de Crédito",
      description: "Gestione y agrega solicitudes de crédito",
      icon: <AccountBalance sx={{ fontSize: 40, color: '#22c55e' }} />,
      path: "/loans"
    },
    {
        title: "Evaluación de Créditos",
        description: "Evalue solicitudes de crédito",
        icon: <Assessment sx={{ fontSize: 40, color: '#22c55e' }} />,
        path: "/loans"
    },  
    {
      title: "Seguimiento de Estado",
      description: "Monitoree el estado de una solicitud",
      icon: <Search sx={{ fontSize: 40, color: '#22c55e' }} />,
      path: "/creditstatus"
    },
    {
      title: "Costos Totales",
      description: "Calcula los costos totales del crédito",
      icon: <Payments sx={{ fontSize: 40, color: '#22c55e' }} />,
      path: "/loan-cost"
    }
  ];

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 6, textAlign: 'center' }}>
        <Typography 
          variant="h3" 
          component="h1" 
          sx={{ 
            mb: 2, 
            color: '#16285a',
            fontWeight: 'bold' 
          }}
        >
          PrestaBanco App Web
        </Typography>
        <Typography 
          variant="h6" 
          sx={{ 
            color: '#16285a',
            maxWidth: '800px',
            margin: '0 auto'
          }}
        >
          Sistema para la gestión de créditos de vivienda y negocios
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {features.map((feature, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card 
              elevation={2}
              sx={{
                height: '100%',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: theme.shadows[4],
                }
              }}
            >
              <CardActionArea 
                sx={{ height: '100%' }}
                onClick={() => navigate(feature.path)}
              >
                <CardContent sx={{ 
                  textAlign: 'center',
                  p: 3
                }}>
                  <Box sx={{ mb: 2 }}>
                    {feature.icon}
                  </Box>
                  <Typography 
                    gutterBottom 
                    variant="h6" 
                    component="h2"
                    sx={{ fontWeight: 'medium' }}
                  >
                    {feature.title}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    color="text.secondary"
                  >
                    {feature.description}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Home;