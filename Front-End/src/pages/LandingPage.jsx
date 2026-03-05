import React from 'react';
import { Box, Button, Typography, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();

  const handleSteamLogin = () => {
    // Redirect to Steam IDP page (will be actual Steam OAuth in production)
    navigate('/steam-auth');
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: '#0a0a0a',
        backgroundImage: 'radial-gradient(circle at 50% 50%, #1a1a1a 0%, #0a0a0a 100%)',
      }}
    >
      <Paper
        elevation={8}
        sx={{
          p: 6,
          bgcolor: '#1e1e1e',
          borderRadius: 3,
          textAlign: 'center',
          maxWidth: 500,
          border: '1px solid #2a2a2a',
        }}
      >
        <Box sx={{ mb: 4 }}>
          <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 3 }}>
            Dino Panel
          </Typography>
        </Box>

        <Typography variant="h6" sx={{ mb: 4, color: '#9e9e9e' }}>
          Sign into Dino Panel?
        </Typography>

        <Button
          onClick={handleSteamLogin}
          sx={{
            backgroundColor: '#171a21',
            '&:hover': {
              backgroundColor: '#2a475e',
            },
            p: 0,
            borderRadius: 1,
            overflow: 'hidden',
          }}
        >
          <img
            src="https://community.cloudflare.steamstatic.com/public/images/signinthroughsteam/sits_01.png"
            alt="Sign in through Steam"
            style={{ height: '35px', display: 'block' }}
          />
        </Button>

        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 4 }}>
          Manage your dinosaurs, view stats, and take actions
        </Typography>
      </Paper>
    </Box>
  );
};

export default LandingPage;
